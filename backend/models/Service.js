import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    icon: { type: String },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  {
    collection: 'services',
    timestamps: true,
    strict: false
  }
);

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
