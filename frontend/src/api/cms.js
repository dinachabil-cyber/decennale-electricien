const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

export async function fetchPageBySlug(slug) {
  const response = await fetch(`${API_URL}/pages/slug/${slug}`);
  if (!response.ok) {
    throw new Error('Page not found');
  }
  return response.json();
}

export async function fetchAllPages() {
  const response = await fetch(`${API_URL}/pages`);
  if (!response.ok) {
    throw new Error('Failed to fetch pages');
  }
  return response.json();
}

export async function createPage(data) {
  const response = await fetch(`${API_URL}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create page');
  }
  return response.json();
}

export async function updatePage(id, data) {
  const response = await fetch(`${API_URL}/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update page');
  }
  return response.json();
}

export async function deletePage(id) {
  const response = await fetch(`${API_URL}/pages/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete page');
  }
  return response.json();
}

export async function addSection(pageId, data) {
  const response = await fetch(`${API_URL}/pages/${pageId}/sections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add section');
  }
  return response.json();
}

export async function updateSection(id, data) {
  const response = await fetch(`${API_URL}/sections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update section');
  }
  return response.json();
}

export async function deleteSection(id) {
  const response = await fetch(`${API_URL}/sections/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete section');
  }
  return response.json();
}

export async function reorderSections(pageId, sectionIds) {
  const response = await fetch(`${API_URL}/pages/${pageId}/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sections: sectionIds })
  });
  if (!response.ok) {
    throw new Error('Failed to reorder sections');
  }
  return response.json();
}

export async function fetchLeads() {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`${API_URL}/leads`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }
  return response.json();
}

const AUTH_API_URL = `${API_URL}/auth`;

export async function login(email, password) {
  console.log('Logging in to:', `${AUTH_API_URL}/login`);
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  console.log('Login response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login error response:', errorText);
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { error: 'Login failed' };
    }
    throw new Error(error.error || 'Login failed');
  }
  const data = await response.json();
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_email', data.admin.email);
  localStorage.setItem('admin_role', data.admin.role);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_role');
}

export async function verifyToken() {
  const token = localStorage.getItem('admin_token');
  if (!token) return null;
  
  const response = await fetch(`${AUTH_API_URL}/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    logout();
    return null;
  }
  return response.json();
}

export function getAuthHeader() {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
