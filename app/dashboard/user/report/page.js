'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { reportItem } from '../../../lib/api';
import { useState } from 'react';

export default function Report() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('date', data.date);
    formData.append('tags', data.tags);
    if (data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await reportItem(formData);
      alert('Item reported successfully!');
      reset();
      setPreview(null);
      router.push('/dashboard/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Report Item</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <div className="flex space-x-4">
            <label>
              <input type="radio" value="lost" {...register('type', { required: 'Type is required' })} />
              Lost
            </label>
            <label>
              <input type="radio" value="found" {...register('type', { required: 'Type is required' })} />
              Found
            </label>
          </div>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select {...register('category', { required: 'Category is required' })} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books & Notes</option>
            <option value="cards">ID Cards</option>
            <option value="keys">Keys</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="w-full p-2 border rounded"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            {...register('location', { required: 'Location is required' })}
            type="text"
            className="w-full p-2 border rounded"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            {...register('date', { required: 'Date is required' })}
            type="date"
            className="w-full p-2 border rounded"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="e.g., blue, urgent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            {...register('image')}
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleImageChange}
          />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded" />}
        </div>
        <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-700">Submit</button>
      </form>
    </div>
  );
}