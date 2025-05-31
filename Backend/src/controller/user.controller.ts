import type { Context } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET || process.env.KEY;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Input validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};

const isValidUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
};

// Token extraction helper
const extractToken = (c: Context): string | null => {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  const cookieHeader = c.req.header('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies['token'] || null;
  }
  
  return null;
};

export const signup = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { username, email, password } = body;

    // Input validation
    if (!username || !email || !password) {
      return c.json({ status: false, message: 'Username, email, and password are required' }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ status: false, message: 'Invalid email format' }, 400);
    }

    if (!isValidUsername(username)) {
      return c.json({ status: false, message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' }, 400);
    }

    if (!isValidPassword(password)) {
      return c.json({ status: false, message: 'Password must be at least 8 characters with uppercase, lowercase, and number' }, 400);
    }

    // Check for existing user by email or username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username }
        ]
      }
    });

    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'email' : 'username';
      return c.json({ status: false, message: `User with this ${field} already exists` }, 409);
    }

    const hashed = await bcrypt.hash(password, 12); // Increased rounds for better security
    const user = await prisma.user.create({
      data: { 
        username, 
        email: email.toLowerCase(), 
        password: hashed 
      }
    });

    return c.json({
      status: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ status: false, message: 'Registration failed' }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return c.json({ status: false, message: 'Email and password are required' }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ status: false, message: 'Invalid email format' }, 400);
    }

    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return c.json({ status: false, message: 'Invalid credentials' }, 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return c.json({ status: false, message: 'Invalid credentials' }, 401);
    }

    // Set token expiration based on rememberMe flag
    const expiresIn = rememberMe ? '30d' : '24h';
    
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, JWT_SECRET, { expiresIn });
    
    // Set cookie with secure options
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // seconds
    const isProduction = process.env.NODE_ENV === 'production';
    
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${isProduction ? '; Secure' : ''}`);

    return c.json({
      status: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ status: false, message: 'Login failed' }, 500);
  }
};

export const forgotPassword = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ status: false, message: 'Email is required' }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ status: false, message: 'Invalid email format' }, 400);
    }

    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    // Don't reveal whether user exists or not for security
    if (!user) {
      return c.json({ status: true, message: 'If an account with that email exists, a reset link has been sent' });
    }

    const resetToken = jwt.sign({ 
      id: user.id, 
      type: 'password_reset' 
    }, JWT_SECRET, { expiresIn: '15m' }); // Reduced to 15 minutes for security

    await sendResetEmail(user.email, resetToken);

    return c.json({ 
      status: true, 
      message: 'If an account with that email exists, a reset link has been sent' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ status: false, message: 'Failed to process request' }, 500);
  }
};

export const resetPassword = async (c: Context) => {
  try {
    const { token } = c.req.param();
    const body = await c.req.json();
    const { password } = body;

    if (!token || !password) {
      return c.json({ status: false, message: 'Token and password are required' }, 400);
    }

    if (!isValidPassword(password)) {
      return c.json({ status: false, message: 'Password must be at least 8 characters with uppercase, lowercase, and number' }, 400);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number, type: string };
      
      if (decoded.type !== 'password_reset') {
        return c.json({ status: false, message: 'Invalid token type' }, 400);
      }

      const hashed = await bcrypt.hash(password, 12);
      await prisma.user.update({ 
        where: { id: decoded.id }, 
        data: { password: hashed } 
      });

      return c.json({ status: true, message: 'Password updated successfully' });
    } catch (jwtError) {
      return c.json({ status: false, message: 'Invalid or expired token' }, 400);
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ status: false, message: 'Failed to reset password' }, 500);
  }
};

export const getProfile = async (c: Context) => {
  try {
    const token = extractToken(c);
    
    if (!token) {
      return c.json({ status: false, message: 'Unauthorized - No token provided' }, 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
          createdAt: true
        }
      });

      if (!user) {
        return c.json({ status: false, message: 'User not found' }, 404);
      }

      return c.json({
        status: true,
        user
      });
    } catch (jwtError) {
      return c.json({ status: false, message: 'Invalid or expired token' }, 401);
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ status: false, message: 'Failed to fetch profile' }, 500);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const token = extractToken(c);
    
    if (!token) {
      return c.json({ status: false, message: 'Unauthorized - No token provided' }, 401);
    }

    let decoded: { id: number };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    } catch (jwtError) {
      return c.json({ status: false, message: 'Invalid or expired token' }, 401);
    }

    // Handle both JSON and FormData
    let username: string | undefined;
    let profilePicture: File | null = null;

    const contentType = c.req.header('Content-Type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await c.req.formData();
      username = formData.get('username') as string;
      profilePicture = formData.get('profilePicture') as File | null;
    } else {
      const body = await c.req.json();
      username = body.username;
    }

    // Validate username if provided
    if (username && !isValidUsername(username)) {
      return c.json({ 
        status: false, 
        message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' 
      }, 400);
    }

    // Prepare update data
    const updateData: any = {};
    if (username) updateData.username = username;

    // Handle profile picture if provided
    if (profilePicture && profilePicture.size > 0) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(profilePicture.type)) {
        return c.json({ 
          status: false, 
          message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
        }, 400);
      }

      // Check file size (5MB limit)
      if (profilePicture.size > 5 * 1024 * 1024) {
        return c.json({ 
          status: false, 
          message: 'File too large. Maximum size is 5MB.' 
        }, 400);
      }

      try {
        const arrayBuffer = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:${profilePicture.type};base64,${buffer.toString('base64')}`;
        
        // Check encoded size limit for database storage
        if (base64Image.length > 2000000) { // ~2MB limit for Base64
          return c.json({ 
            status: false, 
            message: 'Image too large after encoding. Please choose a smaller image.' 
          }, 400);
        }
        
        updateData.profilePicture = base64Image;
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        return c.json({ 
          status: false, 
          message: 'Error processing image. Please try another format.' 
        }, 400);
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return c.json({ 
        status: false, 
        message: 'No valid fields to update' 
      }, 400);
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: updateData,
        select: { 
          id: true, 
          username: true, 
          email: true, 
          profilePicture: true 
        },
      });

      return c.json({ status: true, user: updatedUser });
    } catch (dbError: any) {
      console.error("Database update error:", dbError);
      if (dbError.code === 'P2002') {
        return c.json({ status: false, message: 'Username already taken' }, 409);
      }
      return c.json({ status: false, message: 'Database update failed' }, 500);
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ status: false, message: 'Failed to update profile' }, 500);
  }
};

export const verifyToken = async (c: Context) => {
  try {
    const token = extractToken(c);
    
    if (!token) {
      return c.json({ status: false, message: 'No token provided' }, 401);
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { 
          id: true, 
          username: true, 
          email: true,
          profilePicture: true 
        }
      });
      
      if (!user) {
        return c.json({ status: false, message: 'User no longer exists' }, 404);
      }
      
      return c.json({ 
        status: true, 
        message: 'Token is valid',
        user 
      });
    } catch (jwtError) {
      return c.json({ status: false, message: 'Invalid or expired token' }, 401);
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({ status: false, message: 'Server error' }, 500);
  }
};

export const logout = async (c: Context) => {
  try {
    // Clear the cookie
    c.header('Set-Cookie', 'token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0');
    
    return c.json({ 
      status: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ status: false, message: 'Logout failed' }, 500);
  }
};