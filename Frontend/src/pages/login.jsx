import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ email: '', password: '' });

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const newErrors = { email: '', password: '' };
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-b-gray-600 p-2 rounded bg-white text-gray-800"
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-b-gray-600 p-2 pr-10 rounded bg-white text-gray-800"
                required
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-amber-500 border-amber-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Link to="/ForgotPassword" className="text-sm font-medium text-gray-600 hover:text-gray-800 underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#5885AF] text-white py-2 rounded hover:bg-[#46698a] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#5885AF] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
