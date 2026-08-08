import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import Gallery from '../models/Gallery.js';

export const getGalleryItems = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const { data, meta } = await paginate(Gallery, {
    filter,
    query: req.query,
    searchFields: ['title', 'category'],
    defaultSort: req.query.sort || 'order -createdAt',
  });
  sendSuccess(res, 200, data, meta);
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'An image file is required');
  const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'gallery');
  const item = await Gallery.create({
    ...req.body,
    image: { url: uploaded.secure_url, publicId: uploaded.public_id },
  });
  sendSuccess(res, 201, item);
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Gallery item not found');

  const body = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'gallery');
    await deleteFromCloudinary(item.image.publicId);
    body.image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  Object.assign(item, body);
  await item.save();
  sendSuccess(res, 200, item);
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Gallery item not found');
  await deleteFromCloudinary(item.image.publicId);
  sendSuccess(res, 200, { id: req.params.id });
});
