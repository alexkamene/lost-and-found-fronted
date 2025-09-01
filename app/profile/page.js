'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { getProfile, getMyItems, logout } from '../lib/api';

// ErrorModal Component
function ErrorModal({ error, onClose }) {
  if (!error) return null;
  return (
    <Dialog open={!!error} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white p-6 rounded-lg shadow relative max-w-md w-full">
        <Dialog.Title className="text-lg font-bold">Error</Dialog.Title>
        <p className="text-red-500 mt-2">{error}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchProfileAndItems();
    }
  }, [router]);

  const fetchProfileAndItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, itemsResponse] = await Promise.all([getProfile(), getMyItems()]);

      
      setUser(profileResponse.data);

      console.log('Fetched Items:', profileResponse);
      // Explicitly handle the items array with id, title, and status
      const fetchedItems = itemsResponse.data;

     
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile or items');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to logout');
    }
  };

  const handleViewReport = (id) => {
    
    router.push(`/item/${id}`);
  };

  // Filter items by name (title)
  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  if (loading) {
    return (
      <div className="text-center mt-72">
        <div className="animate-spin rounded-full h-14 w-12 border-b-2     border-blue-800 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p>Manage your account settings</p>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center gap-4">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span>📞 {user.phone || 'Not Provided'}</span>
              <span>
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}

              </span>
              <span className='text-green-500'>
                 Role {user.role}

              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {/* My Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">My Reports</h3>
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by item name..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <span
                    className={`mt-1 inline-block px-2 py-1 text-xs rounded ${
                      item.status === 'FOUND' ? 'bg-green-100 text-green-800' :
                      item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <button
                  onClick={() => handleViewReport(item.id)}
                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reports found.</p>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Notification Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>Push Notifications</span>
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              className="toggle toggle-primary"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Email Notifications</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="toggle toggle-primary"
            />
          </label>
        </div>
      </div>
    </div>
  );
}