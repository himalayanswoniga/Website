import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import SiteSettings from '../models/SiteSettings.js';

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  sendSuccess(res, 200, settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  // Shallow-merge each top-level section (hero, about, packaging, ...) so a
  // partial payload from one admin sub-form never wipes the other sections.
  for (const [key, value] of Object.entries(req.body)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && settings[key] && typeof settings[key].toObject === 'function') {
      settings[key] = { ...settings[key].toObject(), ...value };
    } else {
      settings[key] = value;
    }
  }

  await settings.save();
  sendSuccess(res, 200, settings);
});

export const uploadAboutImage = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'settings');
  if (settings.about?.image?.publicId) await deleteFromCloudinary(settings.about.image.publicId);
  settings.about.image = { url: uploaded.secure_url, publicId: uploaded.public_id };
  await settings.save();
  sendSuccess(res, 200, settings);
});
