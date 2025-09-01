'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { register as registerUser } from '../lib/api'; // 👈 renamed
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    if (!data.email.endsWith('@zetech.ac.ke')) {
      setError('Please use a valid Zetech University email address.');
      return;
    }
    try {
      const response = await registerUser(data); // 👈 call renamed function
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && (
        <p className="bg-red-100 text-red-700 border border-red-400 p-2 rounded mb-4">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="John Doe" 
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="your.name@zetech.ac.ke" 
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <div className="text-sm text-gray-700">Must be a valid Zetech University email address</div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="07XX XXX XXX"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-[#1e40af] text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
