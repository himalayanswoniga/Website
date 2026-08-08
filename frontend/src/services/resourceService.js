import api from './api';

/**
 * Generic list/get/create/update/remove for a REST resource, so each
 * resource file only needs to add what's actually special about it
 * (multipart image fields, extra endpoints, etc).
 */
export function createResourceService(basePath) {
  return {
    list: (params = {}) => api.get(basePath, { params }).then((r) => ({ data: r.data.data, meta: r.data.meta })),
    get: (idOrSlug) => api.get(`${basePath}/${idOrSlug}`).then((r) => r.data.data),
    create: (payload) => api.post(basePath, payload).then((r) => r.data.data),
    update: (id, payload) => api.put(`${basePath}/${id}`, payload).then((r) => r.data.data),
    remove: (id) => api.delete(`${basePath}/${id}`).then((r) => r.data.data),
  };
}

/**
 * Builds a multipart FormData body. `fields` must be flat (string/number/
 * boolean) — the corresponding controllers assemble any nested shape
 * (e.g. Team's socialLinks) server-side from flat keys, since multipart
 * bodies can't carry nested objects.
 */
export function toFormData(fields, fileEntries = []) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });
  fileEntries.forEach(([fieldName, file]) => {
    if (!file) return;
    if (Array.isArray(file)) file.forEach((f) => formData.append(fieldName, f));
    else formData.append(fieldName, file);
  });
  return formData;
}
