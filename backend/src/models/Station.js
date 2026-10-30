import mongoose from 'mongoose';

const connectorSchema = new mongoose.Schema({
  connectorType: { 
    type: String, 
    enum: ['15A_AC_3PIN', 'TYPE_2', 'ATHER_PROPRIETARY', 'OLA_HYPER', 'SWAPPABLE_DOCK', 'CCS2'], 
    required: true 
  },
  powerKw: { type: Number, required: true },
  portsTotal: { type: Number, default: 2 },
  portsAvailable: { type: Number, default: 1 },
  pricePerKwh: { type: Number, default: 16 } // INR per kWh or session
});

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    operator: { type: String, required: true }, // Tata Power, Ather Grid, BESCOM, Jio-bp, etc.
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, default: 'Bengaluru' },
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
    connectors: [connectorSchema],
    accessType: { 
      type: String, 
      enum: ['PUBLIC', 'RESTRICTED_COMMERCIAL', 'COMMUNITY_SHARED'], 
      default: 'PUBLIC' 
    },
    verificationStatus: { 
      type: String, 
      enum: ['VERIFIED', 'COMMUNITY_REPORTED', 'PENDING'], 
      default: 'VERIFIED' 
    },
    lastVerifiedAt: { type: Date, default: Date.now },
    source: { type: String, default: 'AUDITED_OPERATOR' },
    is24Hours: { type: Boolean, default: true },
    amenities: [{ type: String }], // Cafe, Restroom, Parking, Wi-Fi
    rating: { type: Number, default: 4.5 },
    reportsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 2dsphere index for MongoDB geospatial queries
stationSchema.index({ location: '2dsphere' });

export const Station = mongoose.model('Station', stationSchema);
