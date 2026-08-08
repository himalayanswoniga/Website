import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'General' },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
