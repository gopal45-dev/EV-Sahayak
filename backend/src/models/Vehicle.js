import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true }, // e.g. Ather, Ola, TVS, Hero Vida, Bounce
    modelName: { type: String, required: true }, // e.g. 450X, S1 Pro, iQube, V1 Pro, Infinity E1
    variant: { type: String, default: 'Standard' },
    year: { type: Number, default: 2024 },
    batteryCapacityKwh: { type: Number, required: true },
    connectorType: { 
      type: String, 
      enum: ['15A_AC_3PIN', 'TYPE_2', 'ATHER_PROPRIETARY', 'OLA_HYPER', 'SWAPPABLE_MODULAR'], 
      required: true 
    },
    hasSwappableBattery: { type: Boolean, default: false },
    batteryPackModel: { type: String, default: '' }, // e.g. 'Vida Removable Pack 3.94kWh', 'Bounce Dock 2kWh'
    registrationNumber: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
