import mongoose from 'mongoose';

const pricingRouteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    routeType: { type: String, enum: ['PLAIN', 'HILL', 'MIXED'], default: 'PLAIN' },
    pricingType: { type: String, enum: ['fixed', 'per_km'], default: 'fixed' },
    vehiclePrices: { type: Object, default: {} },
    distanceKm: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  {
    collection: 'pricing_routes',
    timestamps: true,
    strict: false
  }
);

export const PricingRoute = mongoose.models.PricingRoute || mongoose.model('PricingRoute', pricingRouteSchema);
export default PricingRoute;
