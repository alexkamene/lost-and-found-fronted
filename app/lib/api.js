import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lost-and-found-backend-7c67.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => api.post('/api/auth/login', data);

export const register = (data) => api.post('/api/auth/register', data);

export const reportItem = (data) =>
  api.post('/api/items', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getItems = (params) => api.get('/api/items', { params });

export const getApprovedItems = (params) => api.get('/api/items/approved', { params });

export const getProfile = () => api.get('/api/auth/me');

export const getMyItems = () => api.get('/api/items/myitems');

export const getItemById = (id) => api.get(`/api/items/${id}`);

export const claimItem = (id) => api.put(`/api/items/${id}/claim`);

export const getPendingItems = () => api.get('/api/admin/pending');

export const getAllItems = (params) => api.get('/api/admin/items', { params });

export const getApprovedAdminItems = (params) => api.get('/api/admin/approved', { params });

export const approveItem = (id) => api.put(`/api/admin/items/${id}/approve`);

export const rejectItem = (id) => api.put(`/api/admin/items/${id}/reject`);

export const deleteItem = (id) => api.delete(`/api/admin/items/${id}`);

export const getUsers = (search) => api.get('/api/admin/users', { params: { search } });

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const submitClaimRequest = (itemId, claimData) =>
  api.post('/api/items/claimsitem', {
    itemId,
    ...claimData
  });

// New exports for AdminClaims
export const getAdminClaims = () => api.get('/api/admin/claimrequest');

export const updateClaimStatus = (itemId, claimId, action) =>
  api.put(`/api/items/${itemId}/claims/${claimId}`, { action });



export const approveClaim = (itemId, claimId) =>
  API.patch(`/api/items/claims/${itemId}/${claimId}/approve`);
export const rejectClaim = (itemId, claimId) =>
  API.patch(`/claims/${itemId}/${claimId}/reject`);
