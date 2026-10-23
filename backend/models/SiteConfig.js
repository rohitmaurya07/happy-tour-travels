import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'siteConfig' },
    businessName: { type: String, default: 'Happy Tour & Travels' },
    slogan: { type: String, default: 'Travel Comfortably. Arrive Confidently.' },
    subtitle: { type: String },
    whatsappNumber: { type: String },
    whatsappNumberFormatted: { type: String },
    phoneNumberFormatted: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
    instagramUrl: { type: String },
    facebookUrl: { type: String },
    primaryCity: { type: String, default: 'Jalandhar' },
    primaryState: { type: String, default: 'Punjab' },
    serviceAreas: [{ type: String }],
    workingHours: { type: String, default: '24/7 Available (365 Days)' },
    googleMapsEmbedUrl: { type: String },
    popularDestinations: [{ type: Object }],
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'site_configs',
    timestamps: true,
    strict: false
  }
);

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);
export default SiteConfig;
