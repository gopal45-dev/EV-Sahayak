import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Provider } from '../models/Provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const PROVIDERS_FILE = path.join(DATA_DIR, 'providers.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let providers = [];

// Load persistent helpers from disk if available
try {
  if (fs.existsSync(PROVIDERS_FILE)) {
    const raw = fs.readFileSync(PROVIDERS_FILE, 'utf-8');
    providers = JSON.parse(raw);
  } else {
    providers = []; // Zero demo data; clean production start
    fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(providers, null, 2), 'utf-8');
  }
} catch (e) {
  providers = [];
}

const saveProvidersToDisk = () => {
  try {
    fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(providers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing providers to disk:', err.message);
  }
};

const router = express.Router();

// GET /api/providers - Discover helpers with battery swap vs portable charger filters
router.get('/', (req, res) => {
  const { serviceType, vehicleModel, connectorType, statusOnly } = req.query;
  let filtered = [...providers];

  if (statusOnly === 'available') {
    filtered = filtered.filter(p => p.availabilityStatus === 'AVAILABLE');
  }

  if (serviceType && serviceType !== 'ALL') {
    filtered = filtered.filter(p => 
      p.services.some(s => s.serviceType === serviceType)
    );
  }

  // Filter compatibility if vehicleModel or connectorType provided
  if (vehicleModel) {
    filtered = filtered.filter(p => {
      return p.services.some(s => {
        if (s.serviceType === 'BATTERY_SWAP' && s.batteryModels) {
          return s.batteryModels.some(m => vehicleModel.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(vehicleModel.toLowerCase()));
        }
        if (s.serviceType === 'PORTABLE_CHARGER' && s.chargerConnectorTypes) {
          return true; // Portable charger can serve if connectors match
        }
        return true;
      });
    });
  }

  // PRD rule: protect phone numbers until unlocked! Mask phones in public list.
  const safeProviders = filtered.map(p => ({
    ...p,
    phone: p.maskedPhone // Never send full raw phone number to public listing
  }));

  res.json({ success: true, count: safeProviders.length, providers: safeProviders });
});

// GET /api/providers/:id
router.get('/:id', (req, res) => {
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  // Return masked phone by default
  const safeProvider = {
    ...provider,
    phone: provider.maskedPhone
  };
  res.json({ success: true, provider: safeProvider });
});

// POST /api/providers/register - Register as an EV Sahayak Helper
router.post('/register', (req, res) => {
  const { displayName, phone, areaName, serviceRadiusKm, services } = req.body;

  if (!displayName || !phone || !services || services.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide full name, phone number, and at least one service offering.' });
  }

  const masked = phone.slice(0, 6) + ' XXXXX';
  const newProvider = {
    id: `prov_${Date.now()}`,
    displayName,
    phone,
    maskedPhone: masked,
    areaName: areaName || 'Bengaluru',
    location: { type: 'Point', coordinates: [77.6200, 12.9500] },
    serviceRadiusKm: Number(serviceRadiusKm) || 10,
    availabilityStatus: 'AVAILABLE',
    verificationLevel: 'PHONE_VERIFIED',
    approvalStatus: 'APPROVED',
    rating: 5.0,
    completedRescues: 0,
    responseAvgMinutes: 10,
    services: services.map(s => ({
      serviceType: s.serviceType,
      title: s.title,
      description: s.description || '',
      supportsBatterySwap: s.serviceType === 'BATTERY_SWAP',
      batteryModels: s.batteryModels || [],
      batteryStateOfChargePercent: s.batteryStateOfChargePercent || 100,
      supportsPortableCharger: s.serviceType === 'PORTABLE_CHARGER',
      chargerConnectorTypes: s.chargerConnectorTypes || ['15A_AC_3PIN'],
      chargerKwRating: s.chargerKwRating || 3.3,
      cableLengthMeters: s.cableLengthMeters || 10,
      estimatedServicePrice: s.estimatedServicePrice || 199
    }))
  };

  providers.push(newProvider);
  saveProvidersToDisk();

  if (mongoose.connection.readyState === 1) {
    try {
      Provider.create(newProvider).catch(err => console.warn('Provider Mongo save note:', err.message));
    } catch (e) {}
  }

  res.status(201).json({ 
    success: true, 
    message: 'Welcome to EV Sahayak network! Your helper profile is active.',
    provider: { ...newProvider, phone: newProvider.maskedPhone } 
  });
});

// PATCH /api/providers/:id/availability - Toggle helper availability
router.patch('/:id/availability', (req, res) => {
  const { availabilityStatus } = req.body;
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  provider.availabilityStatus = availabilityStatus || (provider.availabilityStatus === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE');
  saveProvidersToDisk();
  res.json({ success: true, message: `Availability status set to ${provider.availabilityStatus}`, provider });
});

export { router as providerRouter, providers };
