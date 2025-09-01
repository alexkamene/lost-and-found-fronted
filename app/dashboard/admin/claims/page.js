'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  getAdminClaims,
  approveClaim,
  rejectClaim,
} from"../../../lib/api"; // adjust path if your lib is elsewhere

export default function AdminClaimsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminClaims();
      // Expecting an array of Items, each containing claimRequests[]
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch claim requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    fetchClaims();
  }, [fetchClaims]);

  const handleDecision = async (itemId, claimId, action) => {
    // action: 'approve' | 'reject'
    setBusy(true);
    setError('');
    try {
      if (action === 'approve') {
        await approveClaim(itemId, claimId);
      } else {
        await rejectClaim(itemId, claimId);
      }
      // Optimistic UI update
      setItems(prev =>
        prev.map(it =>
          it._id === itemId
            ? {
                ...it,
                claimRequests: it.claimRequests.map(c =>
                  c._id === claimId ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c
                ),
              }
            : it
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update claim status');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-2" />
        <p className="text-gray-600">Loading claims…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pending Claim Requests</h1>
        <button
          onClick={fetchClaims}
          className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* If there are absolutely no claims at all */}
      {items.every(i => (i.claimRequests?.length ?? 0) === 0) && (
        <p className="text-center text-gray-500">No claim requests found.</p>
      )}

      {/* Render items that have claims */}
      {items
        .filter(item => (item.claimRequests?.length ?? 0) > 0)
        .map(item => {
          const pending = item.claimRequests.filter(c => c.status === 'pending');
          const nonPending = item.claimRequests.filter(c => c.status !== 'pending');

          return (
            <div key={item._id} className="rounded-lg border p-4 bg-white shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 relative rounded overflow-hidden bg-slate-100">
                  {/* fallback to placeholder if missing */}
                  {/* <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="text-sm text-slate-600">
                        Category: <span className="capitalize">{item.category}</span> &middot; Location: {item.location}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.status === 'claimed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* PENDING CLAIMS */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Pending Claims</h3>
                    {pending.length === 0 ? (
                      <p className="text-sm text-slate-500">No pending claims.</p>
                    ) : (
                      <div className="space-y-3">
                        {pending.map(claim => (
                          <div key={claim._id} className="rounded border p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <p>
                                <span className="font-medium">Claimant:</span>{' '}
                                {claim.user?.name || 'Unknown'} ({claim.user?.email || 'Unknown'})
                              </p>
                              <p>
                                <span className="font-medium">Student ID:</span> {claim.studentId || 'N/A'}
                              </p>
                              <p>
                                <span className="font-medium">Admission No.:</span> {claim.admissionNumber || 'N/A'}
                              </p>
                              <p>
                                <span className="font-medium">National ID:</span> {claim.nationalId || 'N/A'}
                              </p>
                              <p>
                                <span className="font-medium">Contact:</span> {claim.contactNumber || 'N/A'}
                              </p>
                              <p>
                                <span className="font-medium">Submitted:</span>{' '}
                                {claim.createdAt ? new Date(claim.createdAt).toLocaleString() : 'N/A'}
                              </p>
                              <div className="md:col-span-2">
                                <p className="font-medium">Message:</p>
                                <p className="text-slate-700 whitespace-pre-wrap">
                                  {claim.message || 'No message'}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                              <button
                                disabled={busy}
                                onClick={() => handleDecision(item._id, claim._id, 'approve')}
                                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                disabled={busy}
                                onClick={() => handleDecision(item._id, claim._id, 'reject')}
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HISTORY / NON-PENDING */}
                  {nonPending.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-2">Processed Claims</h3>
                      <div className="space-y-3">
                        {nonPending.map(claim => (
                          <div key={claim._id} className="rounded border p-3 text-sm bg-slate-50">
                            <div className="flex flex-wrap gap-x-6 gap-y-1">
                              <p>
                                <span className="font-medium">Claimant:</span>{' '}
                                {claim.user?.name || 'Unknown'} ({claim.user?.email || 'Unknown'})
                              </p>
                              <p>
                                <span className="font-medium">Status:</span>{' '}
                                <span className="capitalize">{claim.status}</span>
                              </p>
                              <p>
                                <span className="font-medium">Submitted:</span>{' '}
                                {claim.createdAt ? new Date(claim.createdAt).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                            {claim.message && (
                              <p className="mt-2">
                                <span className="font-medium">Message:</span> {claim.message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
