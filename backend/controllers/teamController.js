import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { paginate } from '../utils/paginate.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import Team from '../models/Team.js';

export const getTeamMembers = asyncHandler(async (req, res) => {
  const { data, meta } = await paginate(Team, {
    query: req.query,
    searchFields: ['name', 'designation'],
    defaultSort: req.query.sort || 'order -createdAt',
  });
  sendSuccess(res, 200, data, meta);
});

// Multipart bodies can't carry nested objects, so the form sends flat
// facebook/instagram/linkedin fields and we assemble socialLinks here.
function extractSocialLinks(body) {
  const { facebook, instagram, linkedin } = body;
  if (facebook === undefined && instagram === undefined && linkedin === undefined) return undefined;
  return { facebook: facebook || '', instagram: instagram || '', linkedin: linkedin || '' };
}

export const createTeamMember = asyncHandler(async (req, res) => {
  const { facebook, instagram, linkedin, ...body } = req.body;
  const socialLinks = extractSocialLinks(req.body);
  if (socialLinks) body.socialLinks = socialLinks;

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'team');
    body.photo = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }
  const member = await Team.create(body);
  sendSuccess(res, 201, member);
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.findById(req.params.id);
  if (!member) throw new ApiError(404, 'Team member not found');

  const { facebook, instagram, linkedin, ...body } = req.body;
  const socialLinks = extractSocialLinks(req.body);
  if (socialLinks) body.socialLinks = socialLinks;

  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'team');
    if (member.photo?.publicId) await deleteFromCloudinary(member.photo.publicId);
    body.photo = { url: uploaded.secure_url, publicId: uploaded.public_id };
  }

  Object.assign(member, body);
  await member.save();
  sendSuccess(res, 200, member);
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await Team.findByIdAndDelete(req.params.id);
  if (!member) throw new ApiError(404, 'Team member not found');
  if (member.photo?.publicId) await deleteFromCloudinary(member.photo.publicId);
  sendSuccess(res, 200, { id: req.params.id });
});
