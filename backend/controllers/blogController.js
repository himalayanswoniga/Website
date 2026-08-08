import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import { slugify } from '../utils/slugify.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import Blog from '../models/Blog.js';

export const getBlogs = asyncHandler(async (req, res) => {
  const filter = {};
  // Public callers only ever see published posts; the admin panel passes
  // includeDrafts=true (guarded by the `protect` middleware on that route).
  if (req.query.includeDrafts !== 'true') filter.status = 'published';
  if (req.query.tag) filter.tags = req.query.tag;

  const { data, meta } = await paginate(Blog, {
    filter,
    query: req.query,
    searchFields: ['title', 'excerpt', 'content'],
    defaultSort: req.query.sort || '-publishedAt -createdAt',
    populate: { path: 'author', select: 'name' },
  });
  sendSuccess(res, 200, data, meta);
});

export const getBlog = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const blog = await Blog.findOne(query).populate('author', 'name');
  if (!blog) throw new ApiError(404, 'Blog post not found');
  sendSuccess(res, 200, blog);
});

export const createBlog = asyncHandler(async (req, res) => {
  const body = { ...req.body, author: req.user._id };
  body.slug = slugify(body.title);
  if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'blog');
    body.featuredImage = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  const blog = await Blog.create(body);
  sendSuccess(res, 201, blog);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog post not found');

  const body = { ...req.body };
  if (body.title) body.slug = slugify(body.title);
  if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'blog');
    if (blog.featuredImage?.publicId) await deleteFromCloudinary(blog.featuredImage.publicId);
    body.featuredImage = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  Object.assign(blog, body);
  await blog.save();
  sendSuccess(res, 200, blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, 'Blog post not found');
  if (blog.featuredImage?.publicId) await deleteFromCloudinary(blog.featuredImage.publicId);
  sendSuccess(res, 200, { id: req.params.id });
});
