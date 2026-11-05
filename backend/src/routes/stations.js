import express from 'express';
import { 
  getStations, 
  getStationById, 
  upsertStations, 
  addStation, 
  reportStation, 
  getDatabaseStatus 
} from '../services/stationDB.js';
import { fetchLiveStations } from '../services/stationFetchService.js';

const router = express.Router();
let reports = [];

// GET /api/stations - Search & filter charging stations from Database
router.get('/', async (req, res) => {
  try {
    const stations = await getStations(req.query);
    res.json({ success: true, count: stations.length, stations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/stations/db-status - Database status, engine type & station count
router.get('/db-status', async (req, res) => {
  try {
    const status = await getDatabaseStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/stations/fetch-live - Fetch real EV stations via API and store in Database
router.post('/fetch-live', async (req, res) => {
  try {
    const { apiKey, latitude, longitude, radiusKm, limit } = req.body;
    
    // Fetch live stations from API / Registry
    const liveResult = await fetchLiveStations({
      apiKey,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      radiusKm: radiusKm ? Number(radiusKm) : undefined,
      limit: limit ? Number(limit) : undefined
    });

    // Upsert into Database (MongoDB or local persistent JSON)
    const dbResult = await upsertStations(liveResult.stations);

    res.json({
      success: true,
      source: liveResult.source,
      fetchedCount: liveResult.count,
      addedToDb: dbResult.added,
      updatedInDb: dbResult.updated,
      totalInDb: dbResult.total,
      message: `Successfully fetched and synchronized ${liveResult.count} live charging stations to database.`
    });
  } catch (error) {
    console.error('Fetch live stations error:', error.message);
    res.status(500).json({ success: false, message: `Failed fetching live stations: ${error.message}` });
  }
});

// GET /api/stations/:id - Get single station
router.get('/:id', async (req, res) => {
  try {
    const station = await getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }
    res.json({ success: true, station });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/stations/:id/report - Report incorrect station info
router.post('/:id/report', async (req, res) => {
  try {
    const { issueType, notes, reportedBy } = req.body;
    const station = await getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    await reportStation(station.id, { issueType, notes, reportedBy });

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/stations/suggest - Community submission for missing station
router.post('/suggest', async (req, res) => {
  try {
    const { name, operator, address, landmark, coordinates, connectorTypes } = req.body;
    
    const newStation = await addStation({
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
      source: 'COMMUNITY_SUBMISSION',
      is24Hours: false,
      amenities: ['Community Host']
    });

    res.status(201).json({
      success: true,
      message: 'Charging point submitted. Pending community verification.',
      station: newStation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const stationRouter = router;
