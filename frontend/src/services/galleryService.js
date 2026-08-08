import api from './api';
import { createResourceService, toFormData } from './resourceService';

const base = createResourceService('/gallery');

export const galleryService = {
  ...base,
  create: (fields, image) => api.post('/gallery', toFormData(fields, [['image', image]])).then((r) => r.data.data),
  update: (id, fields, image) =>
    api.put(`/gallery/${id}`, toFormData(fields, [['image', image]])).then((r) => r.data.data),
};
