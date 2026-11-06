import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Station } from '../models/Station.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATIONS_FILE = path.join(__dirname, '../../data/stations.json');

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not found in environment.');
      process.exit(1);
    }

    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB Atlas successfully!');

    if (!fs.existsSync(STATIONS_FILE)) {
      console.error('❌ stations.json not found at', STATIONS_FILE);
      process.exit(1);
    }

    const stationsData = JSON.parse(fs.readFileSync(STATIONS_FILE, 'utf-8'));
    console.log(`📋 Found ${stationsData.length} stations in stations.json to seed/sync.`);

    let inserted = 0;
    let updated = 0;

    for (const st of stationsData) {
      const doc = { ...st };
      delete doc._id; // Let Mongo manage or match
      delete doc.id;

      const res = await Station.findOneAndUpdate(
        { name: st.name, operator: st.operator },
        { $set: doc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (res) updated++;
    }

    const totalInAtlas = await Station.countDocuments();
    console.log(`🎉 Seeding complete! Total stations in MongoDB Atlas: ${totalInAtlas}`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during Atlas seeding:', err);
    process.exit(1);
  }
}

seed();

