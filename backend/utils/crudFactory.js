import { asyncHandler } from './asyncHandler.js';
import { ApiError } from './ApiError.js';
import { sendSuccess } from './apiResponse.js';
import { paginate } from './paginate.js';
import { deleteFromCloudinary } from './cloudinaryUpload.js';

/**
 * Generates standard list/get/create/update/delete handlers for a simple
 * Mongoose model, so resources with no special logic (Category, Gallery,
 * Team, Testimonial) don't each re-implement the same CRUD boilerplate.
 */
export function crudFactory(model, { searchFields = [], defaultSort = '-createdAt', imageFields = [] } = {}) {
  const getAll = asyncHandler(async (req, res) => {
    const { data, meta } = await paginate(model, { query: req.query, searchFields, defaultSort });
    sendSuccess(res, 200, data, meta);
  });

  const getOne = asyncHandler(async (req, res) => {
    const doc = await model.findById(req.params.id);
    if (!doc) throw new ApiError(404, `${model.modelName} not found`);
    sendSuccess(res, 200, doc);
  });

  const create = asyncHandler(async (req, res) => {
    const doc = await model.create(req.body);
    sendSuccess(res, 201, doc);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new ApiError(404, `${model.modelName} not found`);
    sendSuccess(res, 200, doc);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, `${model.modelName} not found`);
    await Promise.all(
      imageFields.map((field) => {
        const publicId = field.split('.').reduce((o, k) => o?.[k], doc);
        return publicId ? deleteFromCloudinary(publicId) : null;
      })
    );
    sendSuccess(res, 200, { id: req.params.id });
  });

  return { getAll, getOne, create, update, remove };
}
