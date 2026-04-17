import { getSectionConfig } from '../sections/registry';

const API_URL = process.env.REACT_APP_API_URL || 'http://ecennale-electricien-backend.ddev.site/api';

class CmsApi {
  constructor(baseUrl = API_URL) {
    this.baseUrl = baseUrl;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }

  // Page operations
  async fetchPageBySlug(slug) {
    return this.request(`/pages/slug/${slug}`);
  }

  async fetchPageById(id) {
    return this.request(`/pages/${id}`);
  }

  async fetchAllPages() {
    return this.request('/pages');
  }

  async createPage(data) {
    return this.request('/pages', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePage(id, data) {
    return this.request(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePage(id) {
    return this.request(`/pages/${id}`, { method: 'DELETE' });
  }

  async togglePagePublish(id) {
    return this.request(`/pages/${id}/publish`, { method: 'PATCH' });
  }

  // Section operations
  async addSection(pageId, data) {
    const config = getSectionConfig(data.type);
    const content = data.content || config?.defaultContent || {};
    return this.request(`/pages/${pageId}/sections`, {
      method: 'POST',
      body: JSON.stringify({ type: data.type, content })
    });
  }

  async updateSection(sectionId, content) {
    return this.request(`/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  }

  async deleteSection(sectionId) {
    return this.request(`/sections/${sectionId}`, { method: 'DELETE' });
  }

  async toggleSection(sectionId) {
    return this.request(`/sections/${sectionId}/toggle`, { method: 'PATCH' });
  }

  async reorderSections(pageId, sectionIds) {
    return this.request(`/pages/${pageId}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ sections: sectionIds })
    });
  }

  async savePageSections(pageId, sections) {
    const sectionIds = sections.map(s => s.id);
    return this.reorderSections(pageId, sectionIds);
  }

  // Settings
  async fetchSettings() {
    return this.request('/settings');
  }

  async updateSettings(data) {
    return this.request('/settings', { method: 'PUT', body: JSON.stringify(data) });
  }

  // Media
  async fetchMedia() {
    return this.request('/media');
  }

  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${this.baseUrl}/media`, {
      method: 'POST',
      body: formData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload media');
    }
    return response.json();
  }

  async deleteMedia(filename) {
    return this.request(`/media/${filename}`, { method: 'DELETE' });
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_email', data.admin.email);
    localStorage.setItem('admin_role', data.admin.role);
    return data;
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_role');
  }

  async verifyToken() {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;
    
    try {
      return await this.request('/auth/verify');
    } catch {
      this.logout();
      return null;
    }
  }

  // Combined operations for admin
  async loadPageWithSections(pageId) {
    const page = await this.fetchPageById(pageId);
    return {
      ...page,
      sections: (page.sections || []).sort((a, b) => a.position - b.position)
    };
  }
}

export const cmsApi = new CmsApi();
export default cmsApi;