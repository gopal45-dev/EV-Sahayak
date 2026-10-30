import express from 'express';
import { providers } from './providers.js';

const router = express.Router();
let helpRequests = [];

// Haversine formula to calculate distance in km between two GPS coordinates
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// POST /api/requests - Create an emergency assistance request
router.post('/', (req, res) => {
  const { vehicle, requestedService, location, locationAddress, batteryRemainingPercent } = req.body;

  if (!vehicle || !requestedService) {
    return res.status(400).json({ success: false, message: 'Vehicle details and requested service type are required.' });
  }

  const reqId = `req_${Date.now()}`;
  const now = Date.now();
  const expiresAt = new Date(now + 15 * 60 * 1000).toISOString(); // 15-minute confirmation expiry per PRD

  // Extract live rider coordinates [lng, lat]
  const riderLng = location?.coordinates?.[0] || 77.6413;
  const riderLat = location?.coordinates?.[1] || 12.9784;

  // Find candidate providers who match the requested service and vehicle
  const matched = providers.filter(p => {
    if (p.availabilityStatus !== 'AVAILABLE') return false;

    if (requestedService === 'BATTERY_SWAP') {
      return p.services.some(s => 
        s.serviceType === 'BATTERY_SWAP' && 
        (s.batteryModels.length === 0 || 
         s.batteryModels.some(m => vehicle.modelName.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(vehicle.modelName.toLowerCase())))
      );
    }

    if (requestedService === 'PORTABLE_CHARGER') {
      return p.services.some(s => 
        s.serviceType === 'PORTABLE_CHARGER' &&
        (s.chargerConnectorTypes.includes(vehicle.connectorType) || s.chargerConnectorTypes.includes('15A_AC_3PIN'))
      );
    }

    // ANY_COMPATIBLE
    return p.services.some(s => 
      s.serviceType === 'PORTABLE_CHARGER' || 
      (s.serviceType === 'BATTERY_SWAP' && vehicle.hasSwappableBattery)
    );
  });

  // Build candidate responses from matched providers with live GPS distance & ETA
  const candidateResponses = matched.map((p) => {
    const applicableService = p.services.find(s => {
      if (requestedService === 'BATTERY_SWAP') return s.serviceType === 'BATTERY_SWAP';
      if (requestedService === 'PORTABLE_CHARGER') return s.serviceType === 'PORTABLE_CHARGER';
      return true;
    }) || p.services[0];

    const providerLng = p.location?.coordinates?.[0] || 77.6200;
    const providerLat = p.location?.coordinates?.[1] || 12.9500;
    const distanceKm = calculateDistanceKm(riderLat, riderLng, providerLat, providerLng);
    const etaMinutes = Math.max(5, Math.round(distanceKm * 2.5 + 4));

    return {
      providerId: p.id,
      providerName: p.displayName,
      maskedPhone: p.maskedPhone,
      areaName: p.areaName,
      distanceKm: distanceKm,
      rating: p.rating,
      completedRescues: p.completedRescues,
      serviceOffered: applicableService.serviceType,
      serviceTitle: applicableService.title,
      confirmedPrice: applicableService.estimatedServicePrice, // Helper's on-site service charge
      etaMinutes: etaMinutes,
      status: 'ACCEPTED',
      confirmedAt: new Date(now).toISOString(),
      expiresAt: expiresAt
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm); // Sort by nearest live distance!

  const newRequest = {
    id: reqId,
    userName: req.body.userName || 'Pooja R. (Ather Rider)',
    userPhone: '+91 99014 43900',
    vehicle: {
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      connectorType: vehicle.connectorType,
      hasSwappableBattery: Boolean(vehicle.hasSwappableBattery),
      batteryPackModel: vehicle.batteryPackModel || '',
      batteryRemainingPercent: batteryRemainingPercent || 4
    },
    requestedService,
    location: location || { type: 'Point', coordinates: [77.6413, 12.9784] },
    locationAddress: locationAddress || '100 Feet Rd, Indiranagar, Bengaluru',
    searchRadiusKm: 10,
    status: candidateResponses.length > 0 ? 'MATCHED_PENDING_UNLOCK' : 'SEARCHING',
    candidateResponses,
    selectedProviderId: null,
    contactUnlocked: false,
    createdAt: new Date(now).toISOString(),
    expiresAt: expiresAt
  };

  helpRequests.push(newRequest);

  res.status(201).json({
    success: true,
    message: candidateResponses.length > 0 
      ? `Found ${candidateResponses.length} verified helper(s) ready with ${requestedService.replace('_', ' ').toLowerCase()}!`
      : 'Searching for nearby available helpers. You will receive real-time notifications.',
    request: newRequest
  });
});

// GET /api/requests/:id
router.get('/:id', (req, res) => {
  const request = helpRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }
  res.json({ success: true, request });
});

export { router as requestRouter, helpRequests };
