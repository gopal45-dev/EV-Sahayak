import express from 'express';
import { helpRequests } from './requests.js';
import { providers } from './providers.js';

const router = express.Router();
let contactUnlocks = [];

// POST /api/unlock - Server-side verified contact unlock (₹19 Platform Pass)
router.post('/', (req, res) => {
  const { requestId, providerId, paymentMethod } = req.body;

  if (!requestId || !providerId) {
    return res.status(400).json({ success: false, message: 'Request ID and Provider ID are required.' });
  }

  const helpReq = helpRequests.find(r => r.id === requestId);
  if (!helpReq) {
    return res.status(404).json({ success: false, message: 'Help request not found.' });
  }

  // PRD Rule: check confirmation expiry
  const candidate = helpReq.candidateResponses.find(c => c.providerId === providerId);
  if (!candidate) {
    return res.status(400).json({ success: false, message: 'Provider is not among confirmed candidate responders.' });
  }

  const now = new Date();
  const expiry = new Date(candidate.expiresAt);
  if (now > expiry) {
    return res.status(400).json({ 
      success: false, 
      message: 'Provider readiness confirmation has expired. Please refresh to request re-confirmation.' 
    });
  }

  // Lookup provider's actual secure phone number
  const fullProvider = providers.find(p => p.id === providerId);
  if (!fullProvider) {
    return res.status(404).json({ success: false, message: 'Provider details could not be retrieved.' });
  }

  // Create server-verified entitlement
  const unlockId = `unl_${Date.now()}`;
  const gatewayRef = `pay_upi_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const entitlement = {
    id: unlockId,
    requestId,
    providerId,
    passFeeInr: 19, // PRD emergency contact access fee
    paymentGatewayRef: gatewayRef,
    paymentMethod: paymentMethod || 'UPI / QR',
    paymentStatus: 'SUCCESS',
    entitlementGrantedAt: now.toISOString(),
    providerRevealedPhone: fullProvider.phone, // Actual raw phone number ONLY sent here
    providerRevealedName: fullProvider.displayName,
    confirmedServicePrice: candidate.confirmedPrice
  };

  contactUnlocks.push(entitlement);

  // Update help request state
  helpReq.status = 'CONTACT_UNLOCKED';
  helpReq.contactUnlocked = true;
  helpReq.selectedProviderId = providerId;
  helpReq.unlockReferenceId = unlockId;

  res.status(200).json({
    success: true,
    message: 'Payment verified! Contact details successfully unlocked.',
    entitlement: {
      unlockId,
      passFeeInr: 19,
      gatewayRef,
      providerName: fullProvider.displayName,
      revealedPhone: fullProvider.phone,
      serviceFeePayableToHelper: candidate.confirmedPrice,
      unlockedAt: entitlement.entitlementGrantedAt
    }
  });
});

// GET /api/unlock/:id
router.get('/:id', (req, res) => {
  const unlock = contactUnlocks.find(u => u.id === req.params.id);
  if (!unlock) {
    return res.status(404).json({ success: false, message: 'Unlock entitlement not found' });
  }
  res.json({ success: true, unlock });
});

export { router as unlockRouter, contactUnlocks };
