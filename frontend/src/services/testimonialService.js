import api from './api';
import { createResourceService, toFormData } from './resourceService';

const base = createResourceService('/testimonials');

export const testimonialService = {
  ...base,
  create: (fields, avatar) => api.post('/testimonials', toFormData(fields, [['avatar', avatar]])).then((r) => r.data.data),
  update: (id, fields, avatar) =>
    api.put(`/testimonials/${id}`, toFormData(fields, [['avatar', avatar]])).then((r) => r.data.data),
};
