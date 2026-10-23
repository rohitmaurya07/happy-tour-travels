import mongoose from 'mongoose';

const pricingSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'pricingSettings' },
    toll: { type: String, default: 'actual' },
    parking: { type: String, default: 'actual' },
    stateTax: { type: String, default: 'actual' },
    permit: { type: String, default: 'actual' },
    driverAllowance: { type: Number, default: 300 },
    tollIncluded: { type: Boolean, default: false },
    stateTaxIncluded: { type: Boolean, default: false },
    driverAllowanceIncluded: { type: Boolean, default: true },
    fuelIncluded: { type: Boolean, default: true },
    nightChargesAmount: { type: Number, default: 250 },
    nightChargeStartHour: { type: Number, default: 23 },
    nightChargeEndHour: { type: Number, default: 5 },
    gstPercent: { type: Number, default: 0 },
    gstIncluded: { type: Boolean, default: true },
    termsAndConditions: { type: String },
    roundTripMultipliers: { type: Object },
    roundTripBelowKmThreshold: { type: Number, default: 82 },
    airportOverrides: [{ type: Object }],
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'pricing_settings',
    timestamps: true,
    strict: false
  }
);

export const PricingSettings = mongoose.models.PricingSettings || mongoose.model('PricingSettings', pricingSettingsSchema);
export default PricingSettings;
