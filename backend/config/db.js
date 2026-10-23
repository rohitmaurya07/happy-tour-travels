import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/happytravels';

let isConnected = false;

/**
 * Connect to MongoDB instance or cluster
 * @param {string} [uri] - Optional MongoDB URI override
 * @returns {Promise<mongoose.Connection|null>}
 */
export const connectDb = async (uri = null) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connectionUri = uri || MONGODB_URI;
  const isDemo = connectionUri.includes('demoUser') || connectionUri.includes('cluster0.demo');

  try {
    mongoose.set('strictQuery', false);

    console.log(`[MongoDB] Attempting connection... ${isDemo ? '(Using demo connection string)' : ''}`);
    const conn = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    if (isDemo) {
      console.warn('[MongoDB Notice] Demo credentials detected in backend/.env. Please update MONGODB_URI with your real MongoDB Atlas connection string when ready.');
    }
    return null;
  }
};

/**
 * Check whether MongoDB connection is currently active
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Close database connection
 */
export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

export default connectDb;
