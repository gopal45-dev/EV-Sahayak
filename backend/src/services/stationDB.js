import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Station } from '../models/Station.js';
import { initialStations } from '../seed/mockDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const STATIONS_FILE = path.join(DATA_DIR, 'stations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced with disk
let cachedStations = [];
let lastSyncTimestamp = null;

// Initialize file-backed storage if not existing
const initStorage = () => {
  try {
    if (fs.existsSync(STATIONS_FILE)) {
      const raw = fs.readFileSync(STATIONS_FILE, 'utf-8');
      cachedStations = JSON.parse(raw);
    } else {
      cachedStations = [...initialStations];
      fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
    }
    lastSyncTimestamp = new Date().toISOString();
  } catch (err) {
    console.error('Error initializing station storage:', err.message);
    cachedStations = [...initialStations];
  }
};

initStorage();

const isMongoActive = () => mongoose.connection.readyState === 1;

/**
 * Get all stations with filtering
 */
export const getStations = async (filters = {}) => {
  const { query, connector, operator, verifiedOnly } = filters;

  if (isMongoActive()) {
    try {
      const mongoQuery = {};
      if (verifiedOnly === 'true') {
        mongoQuery.verificationStatus = 'VERIFIED';
      }
      if (operator && operator !== 'ALL') {
        mongoQuery.operator = new RegExp(`^${operator}$`, 'i');
      }
      if (connector && connector !== 'ALL') {
        mongoQuery['connectors.connectorType'] = connector;
      }
      if (query) {
        mongoQuery.$or = [
          { name: new RegExp(query, 'i') },
          { address: new RegExp(query, 'i') },
          { operator: new RegExp(query, 'i') },
          { landmark: new RegExp(query, 'i') }
        ];
      }
      const stations = await Station.find(mongoQuery).lean();
      return stations.map(s => ({ ...s, id: s._id.toString() }));
    } catch (e) {
      console.warn('MongoDB query fallback to local cache:', e.message);
    }
  }

  // File-backed memory query
  let results = [...cachedStations];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      s => s.name.toLowerCase().includes(q) || 
           s.address.toLowerCase().includes(q) ||
           s.operator.toLowerCase().includes(q) ||
           (s.landmark && s.landmark.toLowerCase().includes(q))
    );
  }

  if (connector && connector !== 'ALL') {
    results = results.filter(s => 
      s.connectors?.some(c => c.connectorType === connector)
    );
  }

  if (operator && operator !== 'ALL') {
    results = results.filter(s => s.operator.toLowerCase() === operator.toLowerCase());
  }

  if (verifiedOnly === 'true') {
    results = results.filter(s => s.verificationStatus === 'VERIFIED');
  }

  return results;
};

/**
 * Get single station by ID
 */
export const getStationById = async (id) => {
  if (isMongoActive()) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const found = await Station.findById(id).lean();
        if (found) return { ...found, id: found._id.toString() };
      }
    } catch (e) {}
  }
  return cachedStations.find(s => s.id === id || s._id === id);
};

/**
 * Upsert stations into DB (both MongoDB if active and local persistent JSON)
 */
export const upsertStations = async (newStations = []) => {
  if (!Array.isArray(newStations) || newStations.length === 0) {
    return { added: 0, updated: 0, total: cachedStations.length };
  }

  let addedCount = 0;
  let updatedCount = 0;

  for (const newSt of newStations) {
    const existingIndex = cachedStations.findIndex(s => 
      s.id === newSt.id || 
      (s.name.toLowerCase() === newSt.name.toLowerCase() && s.operator.toLowerCase() === newSt.operator.toLowerCase())
    );

    if (existingIndex >= 0) {
      cachedStations[existingIndex] = { ...cachedStations[existingIndex], ...newSt };
      updatedCount++;
    } else {
      cachedStations.push(newSt);
      addedCount++;
    }

    if (isMongoActive()) {
      try {
        await Station.findOneAndUpdate(
          { name: newSt.name, operator: newSt.operator },
          { $set: newSt },
          { upsert: true, new: true }
        );
      } catch (e) {
        console.warn('MongoDB upsert error for station:', e.message);
      }
    }
  }

  // Save to persistent file
  try {
    fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
    lastSyncTimestamp = new Date().toISOString();
  } catch (err) {
    console.error('Failed writing stations to disk:', err.message);
  }

  return { added: addedCount, updated: updatedCount, total: cachedStations.length };
};

/**
 * Add community station
 */
export const addStation = async (stationData) => {
  const id = `st_user_${Date.now()}`;
  const station = {
    id,
    ...stationData,
    verificationStatus: 'PENDING',
    reportsCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString()
  };

  cachedStations.unshift(station);

  if (isMongoActive()) {
    try {
      const created = await Station.create(station);
      station._id = created._id;
    } catch (e) {
      console.warn('MongoDB create error for community station:', e.message);
    }
  }

  try {
    fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
  } catch (err) {}

  return station;
};

/**
 * Update station verification or operational status (VERIFIED, PENDING, MAINTENANCE)
 */
export const updateStationStatus = async (stationId, status) => {
  const station = cachedStations.find(s => s.id === stationId || s._id === stationId);
  if (station) {
    station.verificationStatus = status;
    if (status === 'VERIFIED') {
      station.reportsCount = 0;
      station.lastVerifiedAt = new Date().toISOString();
    }
  }

  if (isMongoActive()) {
    try {
      const updateData = { 
        verificationStatus: status,
        ...(status === 'VERIFIED' ? { reportsCount: 0, lastVerifiedAt: new Date() } : {})
      };

      if (mongoose.Types.ObjectId.isValid(stationId)) {
        await Station.findByIdAndUpdate(stationId, updateData);
      } else {
        await Station.findOneAndUpdate({ $or: [{ id: stationId }, { name: station?.name }] }, updateData);
      }
    } catch (e) {
      console.warn('MongoDB updateStationStatus error:', e.message);
    }
  }

  try {
    fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
  } catch (err) {}

  return station;
};

/**
 * Delete / Reject a station (e.g. invalid community request)
 */
export const deleteStation = async (stationId) => {
  const index = cachedStations.findIndex(s => s.id === stationId || s._id === stationId);
  let removed = null;
  if (index !== -1) {
    removed = cachedStations.splice(index, 1)[0];
  }

  if (isMongoActive()) {
    try {
      if (mongoose.Types.ObjectId.isValid(stationId)) {
        await Station.findByIdAndDelete(stationId);
      } else {
        await Station.findOneAndDelete({ $or: [{ id: stationId }, { name: removed?.name }] });
      }
    } catch (e) {
      console.warn('MongoDB deleteStation error:', e.message);
    }
  }

  try {
    fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
  } catch (err) {}

  return removed;
};

/**
 * Report issue for a station
 */
export const reportStation = async (stationId, reportData) => {
  const station = cachedStations.find(s => s.id === stationId);
  if (station) {
    station.reportsCount = (station.reportsCount || 0) + 1;
    try {
      fs.writeFileSync(STATIONS_FILE, JSON.stringify(cachedStations, null, 2), 'utf-8');
    } catch (err) {}
  }
  return { success: true };
};

/**
 * Get DB status & metadata
 */
export const getDatabaseStatus = async () => {
  const mongoConnected = isMongoActive();
  let mongoCount = 0;
  if (mongoConnected) {
    try {
      mongoCount = await Station.countDocuments();
    } catch (e) {}
  }

  const verifiedCount = cachedStations.filter(s => s.verificationStatus === 'VERIFIED').length;
  const communityCount = cachedStations.filter(s => s.source === 'COMMUNITY_SUBMISSION').length;

  return {
    engine: mongoConnected ? 'MongoDB (Active)' : 'Persistent File-Backed JSON DB (Active)',
    mongoConnected,
    totalStations: cachedStations.length,
    verifiedCount,
    communityCount,
    lastSyncTimestamp,
    storageLocation: STATIONS_FILE
  };
};

