'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { getItems, getApprovedItems, getMyItems, claimItem, deleteItem as deleteMyItem } from '../../lib/api';
import Navbar from '@/app/components/Navbar';

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

// ItemCard Component
function ItemCard({ item, onDelete }) {
  const [status, setStatus] = useState(item?.status || 'N/A');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleClaim = async () => {
    if (status === 'claimed') return;
    try {
      await claimItem(item._id);
      setStatus('claimed');
      alert('Item marked as claimed');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim item');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMyItem(item._id);
        alert('Item deleted successfully');
        if (onDelete) onDelete(item._id);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={item?.image || 'https://via.placeholder.com/300'}
        alt={item?.title || 'Item'}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <div className="flex justify-between mb-2">
        <span className="text-sm bg-[#1e40af] text-white px-2 py-1 rounded">
          {item?.category || 'N/A'}
        </span>
        <span
          className={`text-sm px-2 py-1 rounded ${
            status === 'approved'
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'claimed'
              ? 'bg-blue-100 text-blue-800'
              : status === 'lost'
              ? 'bg-red-100 text-red-800'
              : status === 'rejected'
              ? 'bg-gray-200 text-gray-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{item?.title || 'Untitled'}</h3>
      <p className="text-sm text-gray-600">{item?.description || 'No description available'}</p>
      <div className="flex justify-between items-center mt-2 gap-4">
        <span className="text-sm text-gray-500">
          {item?.date ? new Date(item.date).toLocaleString() : 'N/A'}
        </span>
        <div className="gap-4 flex">
          <Link href={`/item/${item?._id}`} className="text-blue-600 hover:underline mr-2">
            Details
          </Link>

          <button
            onClick={handleClaim}
            disabled={['claimed', 'lost', 'pending', 'rejected'].includes(status)}
            className={`px-2 py-1 rounded ${
              ['claimed', 'lost', 'pending', 'rejected'].includes(status)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            } mr-2`}
          >
            {status === 'claimed'
              ? 'Claimed'
              : status === 'lost'
              ? 'Lost'
              : status === 'pending'
              ? 'Pending'
              : status === 'rejected'
              ? 'Rejected'
              : 'Claim'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ItemList Component
function ItemList({ items, onDelete }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-10">
        <i className="fas fa-box-open text-4xl text-gray-500 mb-2"></i>
        <p className='text-amber-300'>No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}

// Pagination Component
function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 mx-1">{`Page ${page} of ${pages}`}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

// Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
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
  const [tab, setTab] = useState('all');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, page };
      const response = filters.status === 'approved'
        ? await getApprovedItems(params)
        : await getItems(params);

      const data = response.data;
      const fetchedItems = Array.isArray(data) ? data : data.items || [];

      setItems(fetchedItems);
      setTotal(data.total || fetchedItems.length);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const fetchMyItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMyItems({ ...filters, page });
      const data = response.data;
      const fetchedItems = Array.isArray(data) ? data : data.items || [];

      setMyItems(fetchedItems);
      setTotal(data.total || fetchedItems.length);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load my items');
      setMyItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      if (tab === 'my') {
        fetchMyItems();
      } else {
        fetchItems();
      }
    }
  }, [page, filters, tab, router, fetchItems, fetchMyItems]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const handleDelete = (id) => {
    setMyItems(myItems.filter(item => item._id !== id));
    setItems(items.filter(item => item._id !== id));
  };

  return (
    <>
      {/* <Navbar/> */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Dashboard</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => { setTab('all'); setPage(1); }}
            className={`px-4 py-2 rounded ${tab === 'all' ? ' bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            All Items
          </button>
          <button
            onClick={() => { setTab('my'); setPage(1); }}
            className={`px-4 py-2 rounded ${tab === 'my' ? ' bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            My Items
          </button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            {tab === 'all' ? 'Filter Items' : 'Filter My Items'}
          </h3>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
            <div className="flex flex-row gap-2 mb-2 md:mb-0">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="flex-1 p-1 md:p-2 text-sm md:text-base border rounded"
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
                  className="flex-1 p-1 md:p-2 text-sm md:text-base border rounded"
                >
                  <option value="">All Status</option>
                  <option value="lost">Lost Items</option>
                  <option value="found">Found Items</option>
                  <option value="approved">Approved</option>
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by keyword..."
                className="p-1 md:p-2 text-sm md:text-base border rounded flex-1"
              />

              <input
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className="hidden md:block p-2 text-base border rounded flex-1"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-14 w-12 border-b-2 border-blue-800 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <ErrorModal error={error} onClose={() => setError('')} />
        ) : (
          <>
            <ItemList items={tab === 'my' ? myItems : items} onDelete={handleDelete} />
            <Pagination page={page} pages={pages} setPage={setPage} />
          </>
        )}
      </div>
    </>
  );
}
