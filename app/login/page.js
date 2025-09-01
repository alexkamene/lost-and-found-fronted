'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '../lib/api';
import { useState } from 'react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    if (!data.email.endsWith('@zetech.ac.ke')) {
      setError('Please use a valid Zetech University email address.');
      return;
    }
    try {
      const response = await login(data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/dashboard/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1e40af]">Zetech Lost &amp; Found</h1>
        <p className="text-gray-600 mt-2">
          Find what you&apos;ve lost, return what you&apos;ve found
        </p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Styled error alert */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-[#1e40af] text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-[#475569]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[blue-700] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
