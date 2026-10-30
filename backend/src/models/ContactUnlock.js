import mongoose from 'mongoose';

const contactUnlockSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'HelpRequest', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    passFeeInr: { type: Number, default: 19 }, // ₹19 Platform Contact Access Pass per PRD
    paymentStatus: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS'
    },
    paymentGatewayRef: { type: String, required: true },
    entitlementGrantedAt: { type: Date, default: Date.now },
    providerRevealedPhone: { type: String, required: true },
    providerRevealedName: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'DISPUTED', 'REFUND_REQUESTED', 'RESOLVED'],
      default: 'ACTIVE'
    }
  },
  { timestamps: true }
);

export const ContactUnlock = mongoose.model('ContactUnlock', contactUnlockSchema);
