import mongoose from 'mongoose';

const providerServiceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    enum: ['BATTERY_SWAP', 'PORTABLE_CHARGER', 'HOST_SOCKET', 'EMERGENCY_ASSIST'],
    required: true
  },
  title: { type: String, required: true }, // e.g. "Vida/Bounce Swappable 2kWh Battery Delivery" or "Ola & 15A Portable Charger Rapid Rescue"
  description: { type: String, default: '' },
  
  // Specific for Battery Swap
  supportsBatterySwap: { type: Boolean, default: false },
  batteryModels: [{ type: String }], // ['Hero Vida V1', 'Bounce Infinity E1', 'Sun Mobility Standard']
  batteryStateOfChargePercent: { type: Number, default: 95 },
  
  // Specific for Portable / Mobile Charger
  supportsPortableCharger: { type: Boolean, default: false },
  chargerConnectorTypes: [{ type: String }], // ['15A_AC_3PIN', 'TYPE_2', 'ATHER_PROPRIETARY', 'OLA_HYPER']
  chargerKwRating: { type: Number, default: 3.3 }, // in kW
  cableLengthMeters: { type: Number, default: 10 },

  // Pricing
  estimatedServicePrice: { type: Number, required: true } // INR service fee payable on-site to helper
});

const providerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: { type: String, required: true },
    phone: { type: String, required: true }, // Kept secure on server, masked to public
    maskedPhone: { type: String, default: '+91 98XXX XXXXX' },
    serviceRadiusKm: { type: Number, default: 8, max: 25 },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'ON_A_CALL', 'OFFLINE'],
      default: 'AVAILABLE'
    },
    verificationLevel: {
      type: String,
      enum: ['BASIC', 'PHONE_VERIFIED', 'EQUIPMENT_AUDITED', 'PRO_CERTIFIED'],
      default: 'EQUIPMENT_AUDITED'
    },
    approvalStatus: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'SUSPENDED'],
      default: 'APPROVED'
    },
    services: [providerServiceSchema],
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
    areaName: { type: String, default: 'Indiranagar, Bengaluru' },
    rating: { type: Number, default: 4.9 },
    completedRescues: { type: Number, default: 34 },
    responseAvgMinutes: { type: Number, default: 8 }
  },
  { timestamps: true }
);

providerSchema.index({ location: '2dsphere' });

export const Provider = mongoose.model('Provider', providerSchema);
