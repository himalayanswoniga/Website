import api from './api';
import { createResourceService } from './resourceService';

const base = createResourceService('/contact');

export const contactService = {
  ...base,
  submit: (fields) => api.post('/contact', fields).then((r) => r.data.data),
  markRead: (id, isRead = true) => api.patch(`/contact/${id}/read`, { isRead }).then((r) => r.data.data),
};
