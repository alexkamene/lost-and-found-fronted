'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getPendingItems,
  getAllItems,
  getApprovedAdminItems,
  approveItem,
  rejectItem,
  deleteItem,
  getUsers,
} from '../../lib/api';
import AdminTable from '../../components/AdminTable';

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('pending');
  const [items, setItems] = useState([]); 
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
    location: '',
    tag: '',
  });

  // ✅ Stable fetch function with useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'users') {
        const response = await getUsers(filters.search);
        setUsers(response.data || []);
        setTotal(response.data.length);
        setPages(1);
      } else {
        const params = { ...filters, page };
        const response =
          tab === 'pending'
            ? await getPendingItems()
            : tab === 'approved'
            ? await getApprovedAdminItems(params)
            : await getAllItems(params);

        setItems(tab === 'pending' ? response.data || [] : response.data.items || []);
        setTotal(response.data.total || response.data.length || 0);
        setPages(response.data.pages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      setItems([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [tab, page, filters]);

  // ✅ Effect depends on fetchData + router
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/browse');
    } else {
      fetchData();
    }
  }, [fetchData, router]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await approveItem(id);
      else if (action === 'reject') await rejectItem(id);
      else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this item?')) {
          await deleteItem(id);
        }
      }
      await fetchData(); // ✅ safe to reuse
      alert(`Item ${action}d successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} item`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {['pending', 'approved', 'all', 'users'].map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => {
              setTab(tabKey);
              setPage(1);
            }}
            className={`px-4 py-2 rounded ${
              tab === tabKey ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      {tab !== 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books & Notes</option>
            <option value="cards">ID Cards</option>
            <option value="keys">Keys</option>
            <option value="other">Other</option>
          </select>

          {tab === 'all' && (
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-2 border rounded"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="claimed">Claimed</option>
            </select>
          )}

          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by keyword..."
            className="p-2 border rounded"
          />
          <input
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search by location..."
            className="p-2 border rounded"
          />
          <input
            name="tag"
            value={filters.tag}
            onChange={handleFilterChange}
            placeholder="Search by tag..."
            className="p-2 border rounded"
          />
        </div>
      )}

      {tab === 'users' && (
        <div className="mb-4">
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search users..."
            className="p-2 border rounded w-full"
          />
        </div>
      )}

      {/* Data display */}
      {loading ? (
        <div className="text-center py-10">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-2"></i>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <i className="fas fa-exclamation-circle text-4xl mb-2"></i>
          <p>{error}</p>
        </div>
      ) : (
        <AdminTable
          data={tab === 'users' ? users : items}
          type={tab}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
