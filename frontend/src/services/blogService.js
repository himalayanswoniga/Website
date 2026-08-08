import api from './api';
import { createResourceService, toFormData } from './resourceService';

const base = createResourceService('/blogs');

export const blogService = {
  ...base,
  list: (params = {}) => base.list(params),
  listAdmin: (params = {}) => base.list({ ...params, includeDrafts: 'true' }),
  create: (fields, featuredImage) =>
    api.post('/blogs', toFormData(fields, [['featuredImage', featuredImage]])).then((r) => r.data.data),
  update: (id, fields, featuredImage) =>
    api.put(`/blogs/${id}`, toFormData(fields, [['featuredImage', featuredImage]])).then((r) => r.data.data),
};
