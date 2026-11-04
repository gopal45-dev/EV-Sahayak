import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { stationRouter } from './routes/stations.js';
import { providerRouter } from './routes/providers.js';
import { vehicleRouter } from './routes/vehicles.js';
import { requestRouter } from './routes/requests.js';
import { unlockRouter } from './routes/unlock.js';
import { adminRouter } from './routes/admin.js';
import { featuresRouter } from './routes/features.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', stationRouter);
app.use('/api/providers', providerRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/requests', requestRouter);
app.use('/api/unlock', unlockRouter);
app.use('/api/admin', adminRouter);
app.use('/api/features', featuresRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'EV Sahayak API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 EV Sahayak Backend Server running on http://localhost:${PORT}`);
  });
};

start();
