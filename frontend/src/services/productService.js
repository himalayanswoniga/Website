import api from './api';
import { createResourceService, toFormData } from './resourceService';

const base = createResourceService('/products');

export const productService = {
  ...base,
  create: (fields, images) => api.post('/products', toFormData(fields, [['images', images]])).then((r) => r.data.data),
  update: (id, fields, images) =>
    api.put(`/products/${id}`, toFormData(fields, [['images', images]])).then((r) => r.data.data),
  deleteImage: (productId, imageId) =>
    api.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data.data),
};
