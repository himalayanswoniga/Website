import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import ContactMessage from '../models/ContactMessage.js';

export const submitMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  sendSuccess(res, 201, message);
});

export const getMessages = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isRead === 'true' || req.query.isRead === 'false') {
    filter.isRead = req.query.isRead === 'true';
  }
  const { data, meta } = await paginate(ContactMessage, {
    filter,
    query: req.query,
    searchFields: ['name', 'email', 'message'],
  });
  sendSuccess(res, 200, data, meta);
});

export const getMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) throw new ApiError(404, 'Message not found');
  sendSuccess(res, 200, message);
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead ?? true },
    { new: true }
  );
  if (!message) throw new ApiError(404, 'Message not found');
  sendSuccess(res, 200, message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, 'Message not found');
  sendSuccess(res, 200, { id: req.params.id });
});
