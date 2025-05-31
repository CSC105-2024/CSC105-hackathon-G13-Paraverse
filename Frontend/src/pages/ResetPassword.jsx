import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be less than 100 characters'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldError('');
    setSuccessMsg('');

    const validation = passwordSchema.safeParse({ password });

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input';
      setFieldError(firstError);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3306/auth/reset-password/${token}`, {
        password,
      });

      if (response.data.status) {
        setSuccessMsg('Password has been reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Password reset failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block font-semibold">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-400 p-2 pr-10 rounded"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {fieldError && <p className="text-red-500 text-sm mt-1">{fieldError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#5885AF] text-white py-2 rounded hover:bg-[#46698a] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
