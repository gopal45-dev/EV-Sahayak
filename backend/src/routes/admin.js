import express from 'express';
import { getStations } from '../services/stationDB.js';
import { providers } from './providers.js';
import { helpRequests } from './requests.js';
import { contactUnlocks } from './unlock.js';

const router = express.Router();

// Real Pro Subscriptions Store (populated on user checkout or admin pass)
let subscriptions = [
  {
    id: 'sub_rzp_994101',
    subscriberName: 'Gopal Gupta (Admin)',
    email: 'guptagopaldilipd@gmail.com',
    phone: '98451 22345',
    planType: 'MONTHLY_PRO',
    planName: 'EV Sahayak Pro Pass (Monthly)',
    amount: 299,
    gatewayRef: 'pay_rzp_sub_994101',
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    freeUnlocksUsed: 0
  }
];

// Live SOS emergency missions (starts empty; populated when riders request rescues)
let liveMissions = [];

// GET /api/admin/overview - Extended Admin stats and financial metrics
router.get('/overview', async (req, res) => {
  try {
    const allStations = await getStations();
    const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
    const monthlyRecurringRevenue = activeSubs.reduce((acc, s) => acc + (s.planType === 'ANNUAL_PRO' ? Math.round(s.amount / 12) : s.amount), 0);
    const totalSubRevenue = subscriptions.reduce((acc, s) => acc + s.amount, 0);

    const stats = {
      totalStations: allStations.length,
      verifiedStations: allStations.filter(s => s.verificationStatus === 'VERIFIED').length,
      pendingCommunityStations: allStations.filter(s => s.verificationStatus === 'PENDING').length,
      maintenanceStations: allStations.filter(s => s.verificationStatus === 'MAINTENANCE').length,
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
      activeReportsCount: allStations.filter(s => (s.reportsCount || 0) > 0).length
    };

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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

// POST /api/admin/missions/resolve/:id - Mark an active emergency mission resolved
router.post('/missions/resolve/:id', (req, res) => {
  const missionIndex = liveMissions.findIndex(m => m.id === req.params.id);
  if (missionIndex === -1) {
    return res.status(404).json({ success: false, message: 'Mission not found' });
  }

  const resolved = liveMissions.splice(missionIndex, 1)[0];
  res.json({ success: true, message: `Emergency mission ${resolved.id} marked as resolved!`, mission: resolved });
});

// GET /api/admin/triages - Community submission & report triage queue
router.get('/triages', async (req, res) => {
  try {
    const allStations = await getStations();
    const pending = allStations
      .filter(s => s.verificationStatus === 'PENDING' || (s.reportsCount || 0) > 0)
      .map(s => ({
        id: s.id,
        stationName: s.name,
        operator: s.operator,
        city: s.city || 'Bengaluru',
        address: s.address,
        reportedIssue: s.reportsCount > 0 ? `${s.reportsCount} rider reports pending review` : 'New community station submission awaiting GPS verification',
        status: s.verificationStatus,
        createdAt: s.createdAt || new Date().toISOString()
      }));

    res.json({ success: true, queue: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/triages/approve/:id - Approve a station or clear reports
router.post('/triages/approve/:id', async (req, res) => {
  try {
    const allStations = await getStations();
    const station = allStations.find(s => s.id === req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station triage entry not found' });
    }

    station.verificationStatus = 'VERIFIED';
    station.reportsCount = 0;
    station.lastVerifiedAt = new Date().toISOString();

    res.json({ success: true, message: `Station "${station.name}" approved and marked VERIFIED.`, station });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export const adminRouter = router;
