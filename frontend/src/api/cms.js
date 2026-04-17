const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

const getToken = () => localStorage.getItem('admin_token');
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...options.headers }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const pagesApi = {
  getAll: () => request('/pages'),
  getBySlug: (slug) => request(`/pages/slug/${slug}`),
  getBySlugWithDraft: (slug) => request(`/pages/slug/${slug}?preview=true`),
  getById: (id) => request(`/pages/${id}`),
  create: (data) => request('/pages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request('/pages/${id}', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request('/pages/${id}', { method: 'DELETE' }),
  togglePublish: (id) => request(`/pages/${id}/publish`, { method: 'PATCH' }),
};

export const sectionsApi = {
  create: (pageId, data) => request(`/pages/${pageId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/sections/${id}`, { method: 'DELETE' }),
  toggle: (id) => request(`/sections/${id}/toggle`, { method: 'PATCH' }),
  reorder: (pageId, sectionIds) => request(`/pages/${pageId}/reorder`, { method: 'PATCH', body: JSON.stringify({ sections: sectionIds }) }),
};

export const settingsApi = {
  get: () => request('/settings'),
  update: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const mediaApi = {
  getAll: () => request('/media'),
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/media`, { method: 'POST', body: formData, headers: authHeader() });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  delete: (filename) => request(`/media/${filename}`, { method: 'DELETE' }),
};

export const authApi = {
  login: async (email, password) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('admin_token', data.token);
    return data;
  },
  logout: () => localStorage.removeItem('admin_token'),
  verify: async () => {
    const token = getToken();
    if (!token) return null;
    try {
      return await request('/auth/verify');
    } catch {
      authApi.logout();
      return null;
    }
  },
};

export const login = authApi.login;