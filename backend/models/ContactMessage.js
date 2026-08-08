import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    enquiryType: {
      type: String,
      enum: ['Bulk / Wholesale Order', 'Retail Purchase', 'Custom Blend Request', 'Distribution Partnership', 'General Enquiry'],
      default: 'General Enquiry',
    },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
