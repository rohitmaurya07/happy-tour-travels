import mongoose from 'mongoose';

const mediaSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'mediaSettings' },
    heroVideoUrl: { type: String, default: '/assets/herovideo.mp4' },
    heroTitle: { type: String, default: 'Safe, Reliable and Comfortable Taxi Services.' },
    heroHighlightedWord: { type: String, default: 'Taxi Services.' },
    heroSubtitle: { type: String, default: 'Across North India, wherever your journey takes you.' },
    trustBadgeText: { type: String, default: 'Best Taxi Service in North India' },
    logoUrl: { type: String, default: '/assets/images/logo.jpg' },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    collection: 'media_settings',
    timestamps: true,
    strict: false
  }
);

export const MediaSettings = mongoose.models.MediaSettings || mongoose.model('MediaSettings', mediaSettingsSchema);
export default MediaSettings;
