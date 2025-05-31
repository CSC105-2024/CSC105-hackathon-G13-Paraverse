// controller/post.controller.ts
import type { Context } from 'hono';
import { prisma } from '../index.ts';
import { verifyAuth } from '../middleware/auth.ts';

// Create a new post
export const createPost = async (c: Context) => {
  try {
    const userId = await verifyAuth(c);
    if (!userId) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }

    const { title, details, category } = await c.req.json();

    // Validate required fields
    if (!title || !details || !category) {
      return c.json({ 
        status: false, 
        message: 'Title, details, and category are required' 
      }, 400);
    }

    const post = await prisma.post.create({
      data: {
        title,
        details,
        category,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    return c.json({
      status: true,
      message: 'Post created successfully',
      post
    }, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ status: false, message: 'Failed to create post' }, 500);
  }
};

// Get all posts with pagination
export const getAllPosts = async (c: Context) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const category = c.req.query('category');
    const search = c.req.query('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    return c.json({
      status: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return c.json({ status: false, message: 'Failed to fetch posts' }, 500);
  }
};

// Get a single post by ID
export const getPostById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ status: false, message: 'Invalid post ID' }, 400);
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    if (!post) {
      return c.json({ status: false, message: 'Post not found' }, 404);
    }

    return c.json({
      status: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    return c.json({ status: false, message: 'Failed to fetch post' }, 500);
  }
};

// Get posts by current user
export const getUserPosts = async (c: Context) => {
  try {
    const userId = await verifyAuth(c);
    if (!userId) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }

    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true
            }
          }
        }
      }),
      prisma.post.count({ where: { authorId: userId } })
    ]);

    return c.json({
      status: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    return c.json({ status: false, message: 'Failed to fetch user posts' }, 500);
  }
};

// Update a post
export const updatePost = async (c: Context) => {
  try {
    const userId = await verifyAuth(c);
    if (!userId) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }

    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ status: false, message: 'Invalid post ID' }, 400);
    }

    const { title, details, category } = await c.req.json();

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return c.json({ status: false, message: 'Post not found' }, 404);
    }

    if (existingPost.authorId !== userId) {
      return c.json({ status: false, message: 'Forbidden: You can only edit your own posts' }, 403);
    }

    // Validate at least one field is provided
    if (!title && !details && !category) {
      return c.json({ 
        status: false, 
        message: 'At least one field (title, details, or category) is required' 
      }, 400);
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (details) updateData.details = details;
    if (category) updateData.category = category;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    return c.json({
      status: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    return c.json({ status: false, message: 'Failed to update post' }, 500);
  }
};

// Delete a post
export const deletePost = async (c: Context) => {
  try {
    const userId = await verifyAuth(c);
    if (!userId) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }

    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ status: false, message: 'Invalid post ID' }, 400);
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return c.json({ status: false, message: 'Post not found' }, 404);
    }

    if (existingPost.authorId !== userId) {
      return c.json({ status: false, message: 'Forbidden: You can only delete your own posts' }, 403);
    }

    await prisma.post.delete({
      where: { id }
    });

    return c.json({
      status: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return c.json({ status: false, message: 'Failed to delete post' }, 500);
  }
};

// Get available categories
export const getCategories = async (c: Context) => {
  try {
    const categories = await prisma.post.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    const categoryList = categories.map(c => c.category);

    return c.json({
      status: true,
      categories: categoryList
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return c.json({ status: false, message: 'Failed to fetch categories' }, 500);
  }
};