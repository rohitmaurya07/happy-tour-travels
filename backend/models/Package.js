import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String },
    duration: { type: String },
    pickup: { type: String },
    destinations: [{ type: String }],
    image: { type: String },
    price: { type: Number },
    originalPrice: { type: Number },
    vehicleRates: { type: Object, default: {} },
    highlights: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [{ type: Object }],
    description: { type: String },
    popular: { type: Boolean, default: false }
  },
  {
    collection: 'packages',
    timestamps: true,
    strict: false
  }
);

export const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);
export default Package;
