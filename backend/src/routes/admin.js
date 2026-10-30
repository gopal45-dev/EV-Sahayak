import express from 'express';
import { stations, reports } from './stations.js';
import { providers } from './providers.js';
import { helpRequests } from './requests.js';
import { contactUnlocks } from './unlock.js';

const router = express.Router();

// GET /api/admin/overview - Admin stats and summary
router.get('/overview', (req, res) => {
  const stats = {
    totalStations: stations.length,
    verifiedStations: stations.filter(s => s.verificationStatus === 'VERIFIED').length,
    pendingCommunityStations: stations.filter(s => s.verificationStatus === 'PENDING').length,
    totalHelpers: providers.length,
    availableHelpers: providers.filter(p => p.availabilityStatus === 'AVAILABLE').length,
    batterySwapHelpers: providers.filter(p => p.services.some(s => s.serviceType === 'BATTERY_SWAP')).length,
    portableChargerHelpers: providers.filter(p => p.services.some(s => s.serviceType === 'PORTABLE_CHARGER')).length,
    totalHelpRequests: helpRequests.length,
    completedUnlocks: contactUnlocks.length,
    totalPlatformRevenueInr: contactUnlocks.length * 19,
    activeReportsCount: reports.filter(r => r.status === 'PENDING_REVIEW').length
  };

  res.json({ success: true, stats });
});

// GET /api/admin/reports - View submitted station issues
router.get('/reports', (req, res) => {
  res.json({ success: true, reports });
});

// PATCH /api/admin/stations/:id/verify - Approve or reject station
router.patch('/stations/:id/verify', (req, res) => {
  const { status } = req.body; // 'VERIFIED' or 'REJECTED'
  const station = stations.find(s => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Station not found' });
  }

  station.verificationStatus = status || 'VERIFIED';
  station.lastVerifiedAt = new Date().toISOString();

  res.json({ success: true, message: `Station status set to ${station.verificationStatus}`, station });
});

export { router as adminRouter };
