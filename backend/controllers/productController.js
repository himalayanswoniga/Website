import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import { slugify } from '../utils/slugify.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import Product from '../models/Product.js';

export const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;

  const { data, meta } = await paginate(Product, {
    filter,
    query: req.query,
    searchFields: ['name', 'shortDescription', 'description'],
    defaultSort: req.query.sort || 'order -createdAt',
    populate: { path: 'category', select: 'name slug' },
  });
  sendSuccess(res, 200, data, meta);
});

export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, 200, product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  body.slug = slugify(body.name);

  if (req.files?.length) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'products'))
    );
    body.images = uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id }));
  }

  const product = await Product.create(body);
  sendSuccess(res, 201, product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const body = { ...req.body };
  if (body.name) body.slug = slugify(body.name);

  if (req.files?.length) {
    const uploads = await Promise.all(
      req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'products'))
    );
    const newImages = uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id }));
    body.images = [...product.images, ...newImages];
  }

  Object.assign(product, body);
  await product.save();
  sendSuccess(res, 200, product);
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const image = product.images.id(req.params.imageId) || product.images.find((i) => i.publicId === req.params.imageId);
  if (!image) throw new ApiError(404, 'Image not found on this product');

  await deleteFromCloudinary(image.publicId);
  product.images = product.images.filter((i) => i.publicId !== image.publicId);
  await product.save();
  sendSuccess(res, 200, product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  await Promise.all(product.images.map((img) => deleteFromCloudinary(img.publicId)));
  sendSuccess(res, 200, { id: req.params.id });
});
