import mongoose from 'mongoose';

const fleetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String },
    seats: { type: String },
    luggage: { type: String },
    ac: { type: String },
    fuel: { type: String },
    image: { type: String },
    altText: { type: String },
    tag: { type: String },
    rank: { type: Number, default: 0 },
    description: { type: String },
    ratesHint: { type: String },
    minBookingKm: { type: Number, default: 20 },
    slabs: [
      {
        minKm: { type: Number },
        maxKm: { type: Number },
        price: { type: Number }
      }
    ],
    longDistance: {
      startAfterKm: { type: Number, default: 95 },
      baseFare: { type: Number, default: 1700 },
      additionalKmRate: { type: Number, default: 12 }
    },
    oneWayRate: { type: Number, default: 12 },
    roundTripRate: { type: Number, default: 11 },
    roundTripHillRate: { type: Number },
    packages: { type: Object },
    airportBasePrice: { type: Number, default: 2499 },
    plainRatePerKm: { type: Number, default: 10 },
    hillRatePerKm: { type: Number, default: 12 },
    minimumKm: { type: Number, default: 250 },
    extraKmRate: { type: Number, default: 11 },
    driverAllowance: { type: Number, default: 300 },
    active: { type: Boolean, default: true }
  },
  {
    collection: 'fleet',
    timestamps: true,
    strict: false
  }
);

export const Fleet = mongoose.models.Fleet || mongoose.model('Fleet', fleetSchema);
export default Fleet;
