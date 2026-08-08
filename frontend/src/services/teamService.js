import api from './api';
import { createResourceService, toFormData } from './resourceService';

const base = createResourceService('/team');

export const teamService = {
  ...base,
  create: (fields, photo) => api.post('/team', toFormData(fields, [['photo', photo]])).then((r) => r.data.data),
  update: (id, fields, photo) =>
    api.put(`/team/${id}`, toFormData(fields, [['photo', photo]])).then((r) => r.data.data),
};
