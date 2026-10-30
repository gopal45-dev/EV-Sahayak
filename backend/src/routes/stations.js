import express from 'express';
import { initialStations } from '../seed/mockDatabase.js';

const router = express.Router();
let stations = [...initialStations];
let reports = [];

// GET /api/stations - Search & filter charging stations
router.get('/', (req, res) => {
  const { connector, operator, query, verifiedOnly } = req.query;
  let filtered = [...stations];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      s => s.name.toLowerCase().includes(q) || 
           s.address.toLowerCase().includes(q) ||
           s.operator.toLowerCase().includes(q) ||
           s.landmark.toLowerCase().includes(q)
    );
  }

  if (connector && connector !== 'ALL') {
    filtered = filtered.filter(s => 
      s.connectors.some(c => c.connectorType === connector)
    );
  }

  if (operator && operator !== 'ALL') {
    filtered = filtered.filter(s => s.operator.toLowerCase() === operator.toLowerCase());
  }

  if (verifiedOnly === 'true') {
    filtered = filtered.filter(s => s.verificationStatus === 'VERIFIED');
  }

  res.json({ success: true, count: filtered.length, stations: filtered });
});

// GET /api/stations/:id
router.get('/:id', (req, res) => {
  const station = stations.find(s => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Station not found' });
  }
  res.json({ success: true, station });
});

// POST /api/stations/:id/report - Report incorrect station info
router.post('/:id/report', (req, res) => {
  const { issueType, notes, reportedBy } = req.body;
  const station = stations.find(s => s.id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: 'Station not found' });
  }

  station.reportsCount = (station.reportsCount || 0) + 1;
  const newReport = {
    id: `rep_${Date.now()}`,
    stationId: station.id,
    stationName: station.name,
    issueType: issueType || 'INACCURATE_LOCATION',
    notes: notes || '',
    reportedBy: reportedBy || 'Anonymous EV Rider',
    createdAt: new Date().toISOString(),
    status: 'PENDING_REVIEW'
  };
  reports.push(newReport);

  res.json({ success: true, message: 'Report submitted for review. Thank you for keeping EV Sahayak accurate!', report: newReport });
});

// POST /api/stations/suggest - Community submission for missing station
router.post('/suggest', (req, res) => {
  const { name, operator, address, landmark, coordinates, connectorTypes } = req.body;
  const newStation = {
    id: `st_user_${Date.now()}`,
    name: name || 'Community EV Charging Point',
    operator: operator || 'Independent Host',
    address: address || 'Bengaluru',
    landmark: landmark || '',
    city: 'Bengaluru',
    location: {
      type: 'Point',
      coordinates: coordinates || [77.5946, 12.9716]
    },
    connectors: (connectorTypes || ['15A_AC_3PIN']).map(c => ({
      connectorType: c,
      powerKw: 3.3,
      portsTotal: 1,
      portsAvailable: 1,
      pricePerKwh: 15
    })),
    accessType: 'COMMUNITY_SHARED',
    verificationStatus: 'PENDING', // PRD rule: user submissions remain unverified until reviewed
    lastVerifiedAt: new Date().toISOString(),
    source: 'COMMUNITY_SUBMISSION',
    is24Hours: false,
    amenities: ['Community Host'],
    rating: 5.0,
    reportsCount: 0
  };

  stations.push(newStation);
  res.status(201).json({ success: true, message: 'Station submitted for verification', station: newStation });
});

export { router as stationRouter, stations, reports };
