import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { slugify } from '../utils/slugify.js';
import { crudFactory } from '../utils/crudFactory.js';
import Category from '../models/Category.js';

const base = crudFactory(Category, { searchFields: ['name', 'description'], defaultSort: 'name' });

export const getCategories = asyncHandler(async (req, res) => {
  // Public dropdowns/filters just need the full list, unpaginated.
  if (req.query.all === 'true') {
    const categories = await Category.find().sort('name');
    return sendSuccess(res, 200, categories);
  }
  return base.getAll(req, res);
});

export const getCategory = base.getOne;

export const createCategory = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  return base.create(req, res);
});

export const updateCategory = asyncHandler(async (req, res) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  return base.update(req, res);
});

export const deleteCategory = base.remove;
