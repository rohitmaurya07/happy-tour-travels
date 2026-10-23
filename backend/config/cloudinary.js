import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

// Configure Cloudinary with environment variables or demo credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo-cloud-happytravels',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_api_secret_abcdef123456',
  secure: true
});

/**
 * Check if the active Cloudinary credentials are demo / placeholder credentials
 */
export const isDemoCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  return !cloudName || cloudName.includes('demo') || apiKey === '123456789012345';
};

/**
 * Upload an in-memory buffer directly to Cloudinary (zero server disk usage)
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Cloudinary upload options (folder, resource_type, etc.)
 * @returns {Promise<Object>} Cloudinary upload response object
 */
export const uploadStreamToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: options.resource_type || 'auto',
      folder: options.folder || 'happytravels',
      ...options
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        if (isDemoCloudinary()) {
          console.warn('[Cloudinary Warning] Upload failed using demo credentials. Please update CLOUDINARY_* in backend/.env with your real credentials.');
        }
        return reject(error);
      }
      resolve(result);
    });

    stream.end(buffer);
  });
};

/**
 * Delete a media asset from Cloudinary
 * @param {string} publicId - Public ID of the asset
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
    throw error;
  }
};

export default cloudinary;
