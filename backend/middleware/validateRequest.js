import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(400, 'Validation failed', result.array().map((e) => e.msg));
  }
  next();
}
