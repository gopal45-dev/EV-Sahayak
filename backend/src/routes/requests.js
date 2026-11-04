import express from 'express';
import { providers } from './providers.js';

const router = express.Router();

// Initial active requests list for demonstration and testing
let helpRequests = [
  {
    id: 'req_1081',
    userName: 'Kavita Menon (Ather 450X)',
    userPhone: '+91 98450 11223',
    vehicle: { brand: 'Ather', modelName: '450X Gen 3', connectorType: 'ATHER_PROPRIETARY', batteryRemainingPercent: 6 },
    requestedService: 'PORTABLE_CHARGER',
    locationAddress: '100 Feet Rd, Indiranagar (Near Metro)',
    distanceKm: 1.4,
    proposedPrice: 249,
    status: 'SEARCHING',
    selectedProviderId: null,
    assignedProviderName: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'req_1082',
    userName: 'Anirudh S. (Hero Vida V1)',
    userPhone: '+91 97412 88990',
    vehicle: { brand: 'Hero Vida', modelName: 'V1 Pro', connectorType: 'VIDA_MODULAR', hasSwappableBattery: true, batteryRemainingPercent: 3 },
    requestedService: 'BATTERY_SWAP',
    locationAddress: 'Old Airport Road, Domlur Flyover',
    distanceKm: 3.2,
    proposedPrice: 199,
    status: 'SEARCHING',
    selectedProviderId: null,
    assignedProviderName: null,
    createdAt: new Date().toISOString()
  }
];

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

// GET /api/requests - Get all active help requests
router.get('/', (req, res) => {
  res.json({ success: true, requests: helpRequests });
});

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
      confirmedPrice: applicableService.estimatedServicePrice,
      etaMinutes: etaMinutes,
      status: 'AVAILABLE_TO_ACCEPT',
      confirmedAt: new Date(now).toISOString(),
      expiresAt: expiresAt
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

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
    assignedProviderName: null,
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

// POST /api/requests/:id/accept - Exclusive Acceptance & Concurrency Lock
// Guarantees: If one helper accepts, NO other helper can accept the same request!
router.post('/:id/accept', (req, res) => {
  const { providerId, providerName } = req.body;
  const request = helpRequests.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Rescue request not found or has expired.' });
  }

  // MUTUAL EXCLUSIVITY CHECK:
  // If already locked to another provider
  if (request.selectedProviderId && request.selectedProviderId !== providerId) {
    return res.status(409).json({
      success: false,
      code: 'ALREADY_ASSIGNED',
      message: `This rescue request has already been accepted exclusively by another rescuer (${request.assignedProviderName || 'Nearby Helper'}). Only one helper can be assigned per stranded rider.`,
      assignedTo: request.assignedProviderName,
      assignedAt: request.lockedAt
    });
  }

  // Atomically lock exclusively to this helper
  request.status = 'ASSIGNED';
  request.selectedProviderId = providerId || 'prov_demo';
  request.assignedProviderName = providerName || 'QuickEV Assist Rescuer';
  request.lockedAt = new Date().toISOString();

  // Update candidates list: mark this candidate as ACCEPTED, and others as LOCKED_OUT
  if (request.candidateResponses) {
    request.candidateResponses = request.candidateResponses.map(c => {
      if (c.providerId === providerId) {
        return { ...c, status: 'ACCEPTED_BY_YOU' };
      }
      return { ...c, status: 'LOCKED_OUT', lockedOutReason: 'Accepted by another rescuer' };
    });
  }

  res.json({
    success: true,
    message: 'Rescue request locked exclusively to you! No other helper can take this request.',
    request
  });
});

// POST /api/requests/:id/decline - Decline request
router.post('/:id/decline', (req, res) => {
  const { providerId } = req.body;
  const request = helpRequests.find(r => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found.' });
  }

  if (!request.declinedProviderIds) request.declinedProviderIds = [];
  if (providerId) request.declinedProviderIds.push(providerId);

  res.json({
    success: true,
    message: 'You have declined this request. It remains open for other nearby rescuers.',
    request
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
