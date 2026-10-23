import mongoose from 'mongoose';

const popularLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String },
    type: { type: String },
    regionType: { type: String, enum: ['PLAIN', 'HILL', 'MIXED'], default: 'PLAIN' },
    lat: { type: Number },
    lon: { type: Number },
    isPopular: { type: Boolean, default: false },
    isAirport: { type: Boolean, default: false },
    isRailway: { type: Boolean, default: false }
  },
  {
    collection: 'popular_locations',
    timestamps: true,
    strict: false
  }
);

// Compound index on name & state
popularLocationSchema.index({ name: 1, state: 1 });

export const PopularLocation = mongoose.models.PopularLocation || mongoose.model('PopularLocation', popularLocationSchema);
export default PopularLocation;
