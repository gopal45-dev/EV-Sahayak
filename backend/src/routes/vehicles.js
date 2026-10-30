import express from 'express';
import { initialVehicles } from '../seed/mockDatabase.js';

const router = express.Router();
let vehicles = [];

// GET /api/vehicles - List user's vehicles
router.get('/', (req, res) => {
  res.json({ success: true, count: vehicles.length, vehicles });
});

// POST /api/vehicles - Add new vehicle
router.post('/', (req, res) => {
  const { brand, modelName, variant, year, batteryCapacityKwh, connectorType, hasSwappableBattery, batteryPackModel, registrationNumber } = req.body;

  if (!brand || !modelName || !connectorType) {
    return res.status(400).json({ success: false, message: 'Brand, model name, and connector type are required.' });
  }

  const newVehicle = {
    id: `veh_${Date.now()}`,
    brand,
    modelName,
    variant: variant || 'Standard',
    year: Number(year) || 2024,
    batteryCapacityKwh: Number(batteryCapacityKwh) || 3.5,
    connectorType,
    hasSwappableBattery: Boolean(hasSwappableBattery),
    batteryPackModel: batteryPackModel || (hasSwappableBattery ? `${brand} ${modelName} Pack` : 'Fixed Battery'),
    registrationNumber: registrationNumber || '',
    isDefault: vehicles.length === 0
  };

  vehicles.push(newVehicle);
  res.status(201).json({ success: true, message: 'Vehicle added successfully', vehicle: newVehicle });
});

// DELETE /api/vehicles/:id
router.delete('/:id', (req, res) => {
  const initialLen = vehicles.length;
  vehicles = vehicles.filter(v => v.id !== req.params.id);
  if (vehicles.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  res.json({ success: true, message: 'Vehicle removed successfully' });
});

export { router as vehicleRouter, vehicles };
