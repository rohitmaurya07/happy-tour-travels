import mongoose from 'mongoose';

const hourlyRentalPricingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'hourlyRentalPricing' },
    packages: [{ type: Object }],
    defaultRates: { type: Object, default: {} },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'hourly_rental_pricing',
    timestamps: true,
    strict: false
  }
);

export const HourlyRentalPricing = mongoose.models.HourlyRentalPricing || mongoose.model('HourlyRentalPricing', hourlyRentalPricingSchema);
export default HourlyRentalPricing;
