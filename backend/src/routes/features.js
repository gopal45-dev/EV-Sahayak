import express from 'express';

export const featuresRouter = express.Router();

// 1. BESCOM Bengaluru Time-of-Day Grid Tariff Telemetry
featuresRouter.get('/tariffs', (req, res) => {
  const hour = new Date().getHours();
  let tariffZone = 'NORMAL';
  let ratePerKwh = 7.20;
  let nextZoneInHours = 0;

  if (hour >= 22 || hour < 6) {
    tariffZone = 'OFF_PEAK';
    ratePerKwh = 5.50; // Discounted off-peak night rate
    nextZoneInHours = hour >= 22 ? (30 - hour) : (6 - hour);
  } else if (hour >= 18 && hour < 22) {
    tariffZone = 'PEAK';
    ratePerKwh = 8.90; // High peak evening load
    nextZoneInHours = 22 - hour;
  } else {
    tariffZone = 'NORMAL';
    ratePerKwh = 7.20;
    nextZoneInHours = 18 - hour;
  }

  res.json({
    success: true,
    city: 'Bengaluru (BESCOM Zone)',
    zone: tariffZone,
    ratePerKwh: `₹${ratePerKwh.toFixed(2)}`,
    rateNumeric: ratePerKwh,
    solarMixPercent: 44, // Pavagada solar park input
    co2SavedPerKwhKg: 0.82,
    nextZoneInHours,
    recommendation: tariffZone === 'OFF_PEAK' 
      ? 'Optimal charging window: Lowest power tariff active'
      : (tariffZone === 'PEAK' ? 'High grid demand: Consider top-up only or delay charging' : 'Standard tariff: Good availability')
  });
});

// 2. Simulated Live Helper GPS Dispatch Telemetry
featuresRouter.get('/telemetry/:requestId', (req, res) => {
  const { requestId } = req.params;
  const elapsedSecs = Math.floor((Date.now() / 1000) % 900); // 15 min cycle

  // Indiranagar base breakdown point: [77.6412, 12.9784]
  // Helper starting from 1.8km away: [77.6250, 12.9650]
  const progressRatio = Math.min(1, elapsedSecs / 420); // 7 min arrival simulation
  const startLng = 77.6250;
  const startLat = 12.9650;
  const endLng = 77.6412;
  const endLat = 12.9784;

  const currentLng = Number((startLng + (endLng - startLng) * progressRatio).toFixed(5));
  const currentLat = Number((startLat + (endLat - startLat) * progressRatio).toFixed(5));
  const remainingDistanceKm = Math.max(0.1, Number((1.8 * (1 - progressRatio)).toFixed(2)));
  const etaMinutes = Math.max(1, Math.round(remainingDistanceKm * 3.5));

  res.json({
    success: true,
    requestId,
    helperStatus: progressRatio >= 1 ? 'ARRIVED_AT_SCENE' : 'EN_ROUTE',
    currentLocation: { lat: currentLat, lng: currentLng },
    speedKmph: progressRatio >= 1 ? 0 : 28,
    remainingDistanceKm,
    etaMinutes,
    lastPingTimestamp: new Date().toLocaleTimeString()
  });
});

// 3. Indian EV Diagnostic Trouble Code (DTC) Self-Troubleshooter
featuresRouter.get('/dtc/:code', (req, res) => {
  const code = req.params.code.toUpperCase().trim();

  const dtcDatabase = {
    'ATHER-36': {
      brand: 'Ather Energy',
      severity: 'WARNING',
      title: 'Motor Controller Thermal Threshold',
      description: 'Motor temperature sensor detected elevated temp following continuous sport mode riding.',
      actionableSteps: [
        'Park in shaded area and turn key/dash off for 7-10 minutes.',
        'Avoid hill climbs immediately after rebooting.',
        'If warning persists after cooling, request Sahayak mobile boost or flatbed.'
      ]
    },
    'OLA-21': {
      brand: 'Ola Electric',
      severity: 'CRITICAL',
      title: 'BMS High Voltage Isolation Disconnect',
      description: 'Battery Management System isolated main contactor due to voltage imbalance or low terminal SOC.',
      actionableSteps: [
        'Perform hard reset: Press Power + Reverse buttons for 12 seconds until screen reboots.',
        'Do not force ride in Eco throttle limp mode.',
        'Request EV Sahayak emergency mobile 3.3kW portable charger to revitalize terminal voltage.'
      ]
    },
    'VIDA-14': {
      brand: 'Hero Vida',
      severity: 'MEDIUM',
      title: 'Modular Battery Interlock Not Engaged',
      description: 'Under-seat dual battery latch pin not fully locked in connector socket.',
      actionableSteps: [
        'Open under-seat trunk and lift battery module release levers.',
        'Firmly reseat both battery packs until audible click is heard.',
        'Turn ignition off and on to clear warning.'
      ]
    },
    'TVS-09': {
      brand: 'TVS iQube',
      severity: 'WARNING',
      title: 'Charger Port Flap Interlock Active',
      description: 'Charging port door microswitch detecting open or loose flap.',
      actionableSteps: [
        'Inspect charge port door and clean dust around magnetic latch.',
        'Close firmly; dash interlock symbol should disappear within 3 seconds.'
      ]
    }
  };

  const match = dtcDatabase[code] || {
    brand: 'Universal EV',
    severity: 'INFO',
    title: `Diagnostic Code: ${code}`,
    description: 'General system sensor code. Vehicle remains operable in safe speed limp mode.',
    actionableSteps: [
      'Turn off ignition and wait 3 minutes before cycling power.',
      'Check tyre pressure and inspect battery socket connection.',
      'If vehicle will not accelerate, dispatch an emergency Sahayak mobile charger.'
    ]
  };

  res.json({ success: true, code, diagnostic: match });
});

// 4. Battery State-of-Health (SOH) & Degradation Estimator
featuresRouter.post('/soh', (req, res) => {
  const { odometerKm = 12000, ageMonths = 18, fastChargePercent = 30, chemistry = 'LMC' } = req.body;

  // Empirical degradation model for Indian weather (~30-38°C ambient):
  // Calendar aging: ~1.5% per year
  // Cycle aging: ~1% per 10,000 km
  // DC Fast charging penalty factor
  const calendarDegradation = (ageMonths / 12) * 1.6;
  const cycleDegradation = (odometerKm / 10000) * 1.1;
  const fastChargePenalty = (fastChargePercent / 100) * 1.8;

  const totalDegradation = Math.min(30, calendarDegradation + cycleDegradation + fastChargePenalty);
  const sohPercent = Number((100 - totalDegradation).toFixed(1));

  let healthStatus = 'EXCELLENT';
  if (sohPercent < 80) healthStatus = 'DEGRADED';
  else if (sohPercent < 90) healthStatus = 'GOOD';

  res.json({
    success: true,
    sohPercent,
    healthStatus,
    retainedCapacityKwh: Number((3.7 * (sohPercent / 100)).toFixed(2)),
    estimatedLifecycleRemainingKm: Math.max(5000, Math.round((sohPercent - 70) * 1800)),
    tips: [
      'Cap home charging at 85-90% for daily commuting to prolong lithium cell life.',
      'Avoid leaving battery at 0% SOC overnight.',
      'Prefer standard 15A AC charging over daily DC fast chargers when feasible.'
    ]
  });
});

