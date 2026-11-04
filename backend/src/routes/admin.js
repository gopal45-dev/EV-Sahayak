import express from 'express';
import { stations, reports } from './stations.js';
import { providers } from './providers.js';
import { helpRequests } from './requests.js';
import { contactUnlocks } from './unlock.js';

const router = express.Router();

// Mock store for Pro Subscriptions (P1 Feature Requirement)
let subscriptions = [
  {
    id: 'sub_rzp_994101',
    subscriberName: 'Gopal Gupta',
    email: 'guptagopaldilipd@gmail.com',
    phone: '98451 22345',
    planType: 'MONTHLY_PRO',
    planName: 'EV Sahayak Pro Pass (Monthly)',
    amount: 299,
    gatewayRef: 'pay_rzp_sub_994101',
    status: 'ACTIVE',
    startDate: '2026-11-01T10:00:00Z',
    expiryDate: '2026-12-01T10:00:00Z',
    freeUnlocksUsed: 3
  },
  {
    id: 'sub_rzp_883210',
    subscriberName: 'Ananya Rao',
    email: 'ananya.rao@bengaluru.in',
    phone: '98800 77123',
    planType: 'MONTHLY_PRO',
    planName: 'EV Sahayak Pro Pass (Monthly)',
    amount: 299,
    gatewayRef: 'pay_rzp_sub_883210',
    status: 'ACTIVE',
    startDate: '2026-10-25T14:30:00Z',
    expiryDate: '2026-11-25T14:30:00Z',
    freeUnlocksUsed: 6
  },
  {
    id: 'sub_rzp_772109',
    subscriberName: 'Vikram Sundaram',
    email: 'vikram.s@ola-riders.org',
    phone: '97401 55678',
    planType: 'ANNUAL_PRO',
    planName: 'EV Sahayak Fleet Pass (Annual)',
    amount: 2499,
    gatewayRef: 'pay_rzp_sub_772109',
    status: 'ACTIVE',
    startDate: '2026-09-15T09:15:00Z',
    expiryDate: '2027-09-15T09:15:00Z',
    freeUnlocksUsed: 14
  },
  {
    id: 'sub_rzp_661098',
    subscriberName: 'Sneha Patel',
    email: 'sneha.patel@ev.co.in',
    phone: '99160 44321',
    planType: 'MONTHLY_PRO',
    planName: 'EV Sahayak Pro Pass (Monthly)',
    amount: 299,
    gatewayRef: 'pay_rzp_sub_661098',
    status: 'CANCELLED',
    startDate: '2026-09-01T11:20:00Z',
    expiryDate: '2026-10-01T11:20:00Z',
    freeUnlocksUsed: 1
  }
];

// Mock live SOS emergency missions
let liveMissions = [
  {
    id: 'mission_201',
    riderName: 'Kavita Menon',
    riderPhone: '+91 98450 11223',
    vehicleBrand: 'Ather',
    vehicleModel: '450X Gen 3',
    serviceType: 'PORTABLE_CHARGER',
    location: '100 Feet Rd, Indiranagar',
    assignedHelper: 'Ramesh Kumar (QuickEV Assist)',
    status: 'EN_ROUTE',
    distanceKm: 1.4,
    etaMinutes: 5,
    startedAt: '12 mins ago'
  },
  {
    id: 'mission_202',
    riderName: 'Mohammed Zayd',
    riderPhone: '+91 97412 33445',
    vehicleBrand: 'Hero Vida',
    vehicleModel: 'V1 Pro',
    serviceType: 'BATTERY_SWAP',
    location: 'Koramangala 5th Block',
    assignedHelper: 'Sun Mobility / Quick Swap',
    status: 'ARRIVED_ON_SCENE',
    distanceKm: 0.1,
    etaMinutes: 1,
    startedAt: '22 mins ago'
  }
];

// GET /api/admin/overview - Extended Admin stats and financial metrics
router.get('/overview', (req, res) => {
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  const monthlyRecurringRevenue = activeSubs.reduce((acc, s) => acc + (s.planType === 'ANNUAL_PRO' ? Math.round(s.amount / 12) : s.amount), 0);
  const totalSubRevenue = subscriptions.reduce((acc, s) => acc + s.amount, 0);

  const stats = {
    totalStations: stations.length,
    verifiedStations: stations.filter(s => s.verificationStatus === 'VERIFIED').length,
    pendingCommunityStations: stations.filter(s => s.verificationStatus === 'PENDING').length,
    maintenanceStations: stations.filter(s => s.verificationStatus === 'MAINTENANCE').length,
    totalHelpers: providers.length,
    availableHelpers: providers.filter(p => p.availabilityStatus === 'AVAILABLE').length,
    totalHelpRequests: helpRequests.length,
    activeLiveMissions: liveMissions.length,
    completedUnlocks: contactUnlocks.length,
    unlockRevenueInr: contactUnlocks.length * 19,
    helperAuditRevenueInr: providers.length * 49,
    activeSubscriptionsCount: activeSubs.length,
    monthlyRecurringRevenueInr: monthlyRecurringRevenue,
    totalSubscriptionRevenueInr: totalSubRevenue,
    grossPlatformVolumeInr: (contactUnlocks.length * 19) + (providers.length * 49) + totalSubRevenue,
    activeReportsCount: reports.filter(r => r.status === 'PENDING_REVIEW').length
  };

  res.json({ success: true, stats });
});

// GET /api/admin/subscriptions - List all Pro subscription payments with subscriber history
router.get('/subscriptions', (req, res) => {
  res.json({ success: true, subscriptions });
});

// POST /api/admin/subscriptions/cancel/:id - Cancel or refund a subscription
router.post('/subscriptions/cancel/:id', (req, res) => {
  const sub = subscriptions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found' });
  }

  sub.status = 'CANCELLED';
  sub.cancelledAt = new Date().toISOString();
  res.json({ success: true, message: `Subscription ${sub.id} cancelled.`, subscription: sub });
});

// GET /api/admin/missions - Live emergency dispatch mission control
router.get('/missions', (req, res) => {
  res.json({ success: true, missions: liveMissions });
});

// POST /api/admin/missions/:id/status - Update mission status
router.post('/missions/:id/status', (req, res) => {
  const { status } = req.body;
  const mission = liveMissions.find(m => m.id === req.params.id);
  if (!mission) {
    return res.status(404).json({ success: false, message: 'Mission not found' });
  }
  mission.status = status;
  res.json({ success: true, mission });
});

// GET /api/admin/reports - View submitted station issues
router.get('/reports', (req, res) => {
  res.json({ success: true, reports });
});

// PATCH /api/admin/stations/:id/verify - Approve, put to maintenance, or verify station
router.patch('/stations/:id/verify', (req, res) => {
  const { status } = req.body; // 'VERIFIED' | 'MAINTENANCE' | 'REJECTED'
  const station = stations.find(s => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Station not found' });
  }

  station.verificationStatus = status || 'VERIFIED';
  station.lastVerifiedAt = new Date().toISOString();

  res.json({ success: true, message: `Station status set to ${station.verificationStatus}`, station });
});

// PATCH /api/admin/providers/:id/audit - Update helper equipment audit verification level
router.patch('/providers/:id/audit', (req, res) => {
  const { verificationLevel } = req.body; // 'PHYSICALLY_VERIFIED' | 'COMMUNITY_VERIFIED' | 'REJECTED'
  const provider = providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }

  provider.verificationLevel = verificationLevel || 'PHYSICALLY_VERIFIED';
  res.json({ success: true, message: `Helper audit level updated to ${provider.verificationLevel}`, provider });
});

export { router as adminRouter };
