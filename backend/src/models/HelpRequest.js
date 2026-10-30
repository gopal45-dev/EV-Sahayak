import mongoose from 'mongoose';

const candidateResponseSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  providerName: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'], default: 'PENDING' },
  serviceOffered: { 
    type: String, 
    enum: ['BATTERY_SWAP', 'PORTABLE_CHARGER', 'HOST_SOCKET'], 
    required: true 
  },
  confirmedPrice: { type: Number, required: true },
  etaMinutes: { type: Number, default: 15 },
  confirmedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true } // PRD rule: strict timestamped confirmation expiry
});

const helpRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, default: 'Rider' },
    userPhone: { type: String, default: '+91 99000 11223' },
    vehicle: {
      brand: { type: String, required: true },
      modelName: { type: String, required: true },
      connectorType: { type: String, required: true },
      batteryModel: { type: String, default: '' },
      batteryRemainingPercent: { type: Number, default: 4 }
    },
    requestedService: {
      type: String,
      enum: ['PORTABLE_CHARGER', 'BATTERY_SWAP', 'ANY_COMPATIBLE'],
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    locationAddress: { type: String, required: true },
    searchRadiusKm: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ['SEARCHING', 'MATCHED_PENDING_UNLOCK', 'CONTACT_UNLOCKED', 'RESCUE_IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'SEARCHING'
    },
    candidateResponses: [candidateResponseSchema],
    selectedProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    contactUnlocked: { type: Boolean, default: false },
    unlockReferenceId: { type: String, default: '' }
  },
  { timestamps: true }
);

helpRequestSchema.index({ location: '2dsphere' });

export const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
