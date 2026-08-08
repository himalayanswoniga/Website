import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import Testimonial from '../models/Testimonial.js';

export const getTestimonials = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featured === 'true') filter.featured = true;
  const { data, meta } = await paginate(Testimonial, {
    filter,
    query: req.query,
    searchFields: ['name', 'quote', 'location'],
    defaultSort: req.query.sort || 'order -createdAt',
  });
  sendSuccess(res, 200, data, meta);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'testimonials');
    body.avatar = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const testimonial = await Testimonial.create(body);
  sendSuccess(res, 201, testimonial);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');

  const body = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'testimonials');
    if (testimonial.avatar?.publicId) await deleteFromCloudinary(testimonial.avatar.publicId);
    body.avatar = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  Object.assign(testimonial, body);
  await testimonial.save();
  sendSuccess(res, 200, testimonial);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) throw new ApiError(404, 'Testimonial not found');
  if (testimonial.avatar?.publicId) await deleteFromCloudinary(testimonial.avatar.publicId);
  sendSuccess(res, 200, { id: req.params.id });
});
