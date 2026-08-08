import api from './api';

export const settingsService = {
  get: () => api.get('/settings').then((r) => r.data.data),
  update: (section, payload) => api.put('/settings', { [section]: payload }).then((r) => r.data.data),
  uploadAboutImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/settings/about-image', formData).then((r) => r.data.data);
  },
};
