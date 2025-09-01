'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getItemById, submitClaimRequest } from '../../lib/api';

export default function ItemDetail() {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    admissionNumber: '',
    nationalId: '',
    contactNumber: '',
    reason: ''
  });

  const router = useRouter();
  const params = useParams();   // ✅ only use this
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        const response = await getItemById(id);
        setItem(response.data);
        setStatus(response.data.status);
      } catch (err) {
        alert('Failed to load item');
        router.push('/browse');
      }
    };
    fetchItem();
  }, [id, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    try {
      await submitClaimRequest(id, formData);
      setStatus('pending'); // since admin approval is required
      setShowForm(false);
      alert('Claim request submitted successfully. Await admin approval.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit claim');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
      <img
        src={item.image || 'https://via.placeholder.com/300'}
        alt={item.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Category:</strong> {item.category}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded ${
                status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </span>
          </p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
          {item.tags && <p><strong>Tags:</strong> {item.tags.join(', ')}</p>}
        </div>
        <div>
          <p><strong>Reported by:</strong> {item.reporter.name}</p>
          <p><strong>Email:</strong> {item.reporter.email}</p>
          <p><strong>Phone:</strong> {item.reporter.phone}</p>
        </div>
      </div>
      <p className="mb-4">{item.description}</p>

      {status === 'claimed' ? (
        <button
          disabled
          className="w-full p-2 rounded bg-gray-300"
        >
          Already Claimed
        </button>
      ) : (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full p-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Claim now
            </button>
          ) : (
            <form onSubmit={handleClaim} className="space-y-4 mt-4">
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="admissionNumber"
                placeholder="Admission Number"
                value={formData.admissionNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="nationalId"
                placeholder="National ID"
                value={formData.nationalId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Active Contact Number"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="reason"
                placeholder="How is this your item?"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit Claim
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 p-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
