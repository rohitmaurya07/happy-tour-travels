/**
 * Happy Tour & Travels - Data Migration Script
 * Migrates all prices, vehicles, routes, settings, packages, and bookings
 * from local JSON data files to MongoDB.
 *
 * Usage:
 *   node scripts/migrateToMongo.js
 *   node scripts/migrateToMongo.js --uri="mongodb://localhost:27017/happytravels"
 *   npm run migrate:mongo
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import mongoose from 'mongoose';
import connectDb, { disconnectDb } from '../config/db.js';
import { MODEL_REGISTRY } from '../models/index.js';
import { isDemoCloudinary, uploadStreamToCloudinary } from '../config/cloudinary.js';
const DATA_DIR = path.join(__dirname, '..', 'data');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Parse CLI arguments
const args = process.argv.slice(2);
const customUriArg = args.find((a) => a.startsWith('--uri='));
const customUri = customUriArg ? customUriArg.split('=')[1] : null;
const isDryRun = args.includes('--dry-run');

const readDataFile = (fileName) => {
  const filePath = path.join(DATA_DIR, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return null;
  }
};

async function migrateData() {
  console.log('===========================================================');
  console.log('   HAPPY TOUR & TRAVELS - MONGODB DATA MIGRATION');
  console.log('===========================================================');
  if (isDryRun) {
    console.log('ℹ  Running in DRY RUN mode. No data will be written.\n');
  }

  const uri = customUri || process.env.MONGODB_URI;
  console.log(`Connecting to MongoDB...`);
  console.log(`URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);

  let db;
  try {
    db = await connectDb(uri);
    if (!db) {
      console.error('\n✖ FAILED TO CONNECT TO MONGODB:');
      console.error('Could not establish connection to the specified MongoDB instance.\n');
      console.error('If using MongoDB Atlas:');
      console.error('  1. Log in to https://cloud.mongodb.com');
      console.error('  2. Go to "Security" -> "Network Access" in the left sidebar.');
      console.error('  3. Click "Add IP Address" and select "Allow Access From Anywhere" (0.0.0.0/0) or add your current IP.');
      console.error('  4. Wait ~1 minute for Atlas to update, then rerun: npm run migrate:mongo\n');
      console.error('If using Local MongoDB:');
      console.error('  Ensure MongoDB is running, or specify URI: npm run migrate:mongo -- --uri="mongodb://localhost:27017/happytravels"');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n✖ FAILED TO CONNECT TO MONGODB:');
    console.error(`  ${error.message}`);
    console.error('\nTips:');
    console.error('  1. If using demo credentials, update MONGODB_URI in backend/.env with your real MongoDB Atlas URI.');
    console.error('  2. For local MongoDB, ensure MongoDB service is running (e.g. net start MongoDB).');
    console.error('  3. Or run with --uri argument: node scripts/migrateToMongo.js --uri="mongodb://localhost:27017/happytravels"');
    process.exit(1);
  }

  const stats = {
    migrated: {},
    errors: {}
  };

  for (const [entityName, config] of Object.entries(MODEL_REGISTRY)) {
    const { model, type, keyField, idField } = config;
    const fileData = readDataFile(entityName);

    if (fileData === null || fileData === undefined) {
      console.log(`[-] Skipping ${entityName}: No local JSON file found.`);
      continue;
    }

    try {
      if (type === 'single') {
        const count = 1;
        const keyVal = entityName;
        const payload = {
          ...fileData,
          [keyField || 'key']: keyVal,
          updatedAt: new Date().toISOString()
        };

        if (!isDryRun) {
          await model.findOneAndUpdate(
            { [keyField || 'key']: keyVal },
            { $set: payload },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
          );
        }
        stats.migrated[entityName] = 1;
        console.log(`[✓] Migrated ${entityName} (Single Document)`);
      } else if (type === 'array') {
        const items = Array.isArray(fileData) ? fileData : [];
        if (!isDryRun) {
          await model.deleteMany({});
          if (items.length > 0) {
            const sanitized = items.map((item) => {
              const clone = { ...item };
              delete clone._id;
              delete clone.__v;
              return clone;
            });
            await model.insertMany(sanitized, { ordered: false });
          }
        }
        stats.migrated[entityName] = items.length;
        console.log(`[✓] Migrated ${entityName} (${items.length} records)`);
      }
    } catch (err) {
      console.error(`[✖] Failed to migrate ${entityName}:`, err.message);
      stats.errors[entityName] = err.message;
    }
  }

  // Check Cloudinary Status and Uploads
  console.log('\n-----------------------------------------------------------');
  console.log('   CLOUDINARY MEDIA CHECK & STATUS');
  console.log('-----------------------------------------------------------');
  if (isDemoCloudinary()) {
    console.log('[!] Notice: Currently configured with DEMO Cloudinary credentials.');
    console.log('    All media upload endpoints in backend are configured with in-memory buffering (multer.memoryStorage).');
    console.log('    Zero files will be saved on your server disk.');
    console.log('    Once you replace the demo credentials in backend/.env with your real Cloudinary credentials,');
    console.log('    images and videos will stream directly to your Cloudinary cloud automatically.');
  } else {
    console.log('[✓] Real Cloudinary credentials detected.');
    // Check if there are local uploads to migrate
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      if (files.length > 0) {
        console.log(`Found ${files.length} existing files in local uploads folder:`);
        for (const file of files) {
          const filePath = path.join(UPLOADS_DIR, file);
          const stat = fs.statSync(filePath);
          if (stat.isFile() && !isDryRun) {
            try {
              const buffer = fs.readFileSync(filePath);
              const isVideo = file.match(/\.(mp4|webm|mov|ogg)$/i);
              const result = await uploadStreamToCloudinary(buffer, {
                folder: isVideo ? 'happytravels/videos' : 'happytravels/images',
                resource_type: isVideo ? 'video' : 'auto'
              });
              console.log(`  [Uploaded to Cloudinary] ${file} -> ${result.secure_url}`);

              // Automatically replace any /uploads/<file> references in MongoDB with the Cloudinary URL
              const oldPathFragment = `/uploads/${file}`;
              for (const { model, type } of Object.values(MODEL_REGISTRY)) {
                if (type === 'single') {
                  const doc = await model.findOne().lean();
                  if (doc) {
                    let str = JSON.stringify(doc);
                    if (str.includes(oldPathFragment)) {
                      str = str.replaceAll(oldPathFragment, result.secure_url);
                      const parsed = JSON.parse(str);
                      delete parsed._id;
                      delete parsed.__v;
                      await model.findOneAndUpdate({}, { $set: parsed });
                      console.log(`    ↳ Updated media URL reference in settings`);
                    }
                  }
                } else if (type === 'array') {
                  const docs = await model.find().lean();
                  for (const d of docs) {
                    let str = JSON.stringify(d);
                    if (str.includes(oldPathFragment)) {
                      str = str.replaceAll(oldPathFragment, result.secure_url);
                      const parsed = JSON.parse(str);
                      const docId = d._id;
                      delete parsed._id;
                      delete parsed.__v;
                      await model.findByIdAndUpdate(docId, { $set: parsed });
                      console.log(`    ↳ Updated media URL reference in record ${d.id || d.name || docId}`);
                    }
                  }
                }
              }
            } catch (upErr) {
              console.warn(`  [Skipped] ${file}: ${upErr.message}`);
            }
          }
        }
      }
    }
  }

  console.log('\n===========================================================');
  console.log('   MIGRATION SUMMARY');
  console.log('===========================================================');
  let totalRecords = 0;
  for (const [entity, count] of Object.entries(stats.migrated)) {
    console.log(`  - ${entity.padEnd(25)} : ${count} record(s)`);
    totalRecords += count;
  }
  console.log(`\nTotal Entities Migrated: ${totalRecords}`);

  if (Object.keys(stats.errors).length > 0) {
    console.log(`Errors encountered: ${Object.keys(stats.errors).length}`);
  } else {
    console.log('All data successfully migrated to MongoDB!');
  }
  console.log('===========================================================\n');

  await disconnectDb();
  process.exit(0);
}

migrateData().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
