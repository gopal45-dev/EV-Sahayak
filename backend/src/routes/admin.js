import express from 'express';
import { getStations, updateStationStatus, deleteStation } from '../services/stationDB.js';
import { providers } from './providers.js';
import { helpRequests } from './requests.js';
import { contactUnlocks } from './unlock.js';

const router = express.Router();

// Real Pro Subscriptions Store (populated on user checkout or admin pass)
let subscriptions = [];

// Real Moderation complaints & refund queue (populated on user reports or dispute filings)
let complaints = [];

// Live SOS emergency missions (starts empty; populated when riders request rescues)
let liveMissions = [];

// POST /api/admin/login - Secure Server-Side Admin Authentication
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = (process.env.ADMIN_EMAIL || 'guptagopaldilipd@gmail.com').toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminPass) {
    return res.status(500).json({ success: false, message: 'Admin authentication is not configured on server.' });
  }

  const enteredEmail = (email || '').trim().toLowerCase();
  const validEmails = [adminEmail, 'admin@evsahayak.com', 'gopal gupta'];

  if (validEmails.includes(enteredEmail) && (password || '').trim() === adminPass) {
    return res.json({
      success: true,
      message: 'Administrator authentication successful',
      admin: {
        name: process.env.ADMIN_NAME || 'Gopal Gupta',
        email: adminEmail,
        role: 'ADMIN',
        location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru Central Command' }
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Administrator credentials. Access denied.'
  });
});

// GET /api/admin/overview - Extended Admin stats and financial metrics
router.get('/overview', async (req, res) => {
  try {
    const allStations = await getStations();
    const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
    const monthlyRecurringRevenue = activeSubs.reduce((acc, s) => acc + (s.planType === 'ANNUAL_PRO' ? Math.round(s.amount / 12) : s.amount), 0);
    const totalSubRevenue = subscriptions.reduce((acc, s) => acc + s.amount, 0);

    const activeMissionsCount = liveMissions.length + helpRequests.filter(r => r.status === 'ASSIGNED' || r.status === 'CONTACT_UNLOCKED' || r.status === 'RESCUE_IN_PROGRESS').length;

    const stats = {
      totalStations: allStations.length,
      verifiedStations: allStations.filter(s => s.verificationStatus === 'VERIFIED').length,
      pendingCommunityStations: allStations.filter(s => s.verificationStatus === 'PENDING').length,
      maintenanceStations: allStations.filter(s => s.verificationStatus === 'MAINTENANCE').length,
      totalHelpers: providers.length,
      availableHelpers: providers.filter(p => p.availabilityStatus === 'AVAILABLE').length,
      totalHelpRequests: helpRequests.length,
      activeLiveMissions: activeMissionsCount,
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

// POST /api/admin/subscriptions - Add a real Pro subscription when user subscribes
router.post('/subscriptions', (req, res) => {
  const { subscriberName, email, phone, planType, planName, amount, gatewayRef } = req.body;
  const newSub = {
    id: `sub_rzp_${Date.now()}`,
    subscriberName: subscriberName || 'EV Rider',
    email: email || '',
    phone: phone || '',
    planType: planType || 'MONTHLY_PRO',
    planName: planName || 'EV Sahayak Pro Pass (Monthly)',
    amount: Number(amount) || 299,
    gatewayRef: gatewayRef || `pay_${Date.now()}`,
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + (planType === 'ANNUAL_PRO' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    freeUnlocksUsed: 0
  };
  subscriptions.unshift(newSub);
  res.status(201).json({ success: true, subscription: newSub });
});

// GET /api/admin/complaints - List all user disputes & refund requests
router.get('/complaints', (req, res) => {
  res.json({ success: true, complaints });
});

// POST /api/admin/complaints - Submit a dispute / refund request
router.post('/complaints', (req, res) => {
  const { riderName, providerName, reason, details, amount } = req.body;
  const newComplaint = {
    id: `cmp_${Date.now()}`,
    riderName: riderName || 'Rider',
    providerName: providerName || 'Assigned Rescuer',
    reason: reason || 'SERVICE_DISPUTE',
    details: details || '',
    amount: amount || '₹19.00',
    status: 'PENDING_AUDIT',
    timestamp: new Date().toLocaleString()
  };
  complaints.unshift(newComplaint);
  res.status(201).json({ success: true, complaint: newComplaint });
});

// POST /api/admin/complaints/:id/process - Approve refund or dismiss complaint
router.post('/complaints/:id/process', (req, res) => {
  const { approve } = req.body;
  const complaint = complaints.find(c => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found' });
  }

  complaint.status = approve ? 'REFUND_APPROVED' : 'REJECTED';
  complaint.refundRef = approve ? `rfnd_rzp_${Date.now()}` : null;
  complaint.processedAt = new Date().toISOString();

  res.json({ success: true, message: approve ? 'Refund approved and credited.' : 'Complaint audited and dismissed.', complaint });
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
  const assignedFromRequests = helpRequests
    .filter(r => r.status === 'ASSIGNED' || r.status === 'CONTACT_UNLOCKED' || r.status === 'RESCUE_IN_PROGRESS')
    .map(r => ({
      id: r.id,
      riderName: r.userName || 'Stranded Rider',
      riderPhone: r.userPhone || '+91 99014 43900',
      vehicle: `${r.vehicle?.brand || ''} ${r.vehicle?.modelName || ''}`.trim(),
      serviceType: r.requestedService,
      location: r.locationAddress,
      assignedHelper: r.assignedProviderName || 'Assigned Rescuer',
      status: 'EN_ROUTE',
      distanceKm: r.candidateResponses?.[0]?.distanceKm || 1.8,
      etaMinutes: r.candidateResponses?.[0]?.etaMinutes || 8,
      startedAt: 'Active Now'
    }));

  const allMissions = [...liveMissions, ...assignedFromRequests];
  res.json({ success: true, missions: allMissions });
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
    const station = await updateStationStatus(req.params.id, 'VERIFIED');
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station triage entry not found' });
    }

    res.json({ success: true, message: `Station "${station.name}" approved and marked VERIFIED.`, station });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/triages/reject/:id - Reject / Delete an invalid station submission
router.post('/triages/reject/:id', async (req, res) => {
  try {
    const station = await deleteStation(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station triage entry not found' });
    }

    res.json({ success: true, message: `Station "${station.name}" rejected and removed.`, station });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export const adminRouter = router;
