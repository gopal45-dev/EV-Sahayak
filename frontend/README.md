# ⚡ EV Sahayak - Frontend Client

Modern, responsive Web application for the **EV Sahayak** platform. Built with React 19, Vite, Three.js WebGL graphics, and Leaflet interactive maps.

## 🚀 Key Modules

- **Interactive Charging Directory (`InteractiveMap.jsx`, `StationFinder.jsx`)**: 43+ verified public EV charging stations across Bengaluru with connector filtering, live occupancy, and 1-click turn-by-turn Google Maps navigation.
- **Emergency Roadside Rescue (`EmergencyModal.jsx`, `ActiveRequestCard.jsx`)**: Instant SOS dispatch with live GPS broadcast, atomic single-helper acceptance, and simulated dispatch telemetry.
- **Battery Health Diagnostics (`BatteryDiagnostic.jsx`)**: Indian EV DTC trouble-code decoder, battery degradation calculation, and safe commute radius predictor.
- **Admin Command Center (`AdminWorkspace.jsx`)**: Full administrative moderation portal with live station KPIs, helper oversight, and subscription revenue monitoring.
- **Interactive 3D Powertrain (`ThreeVisualizer.jsx`)**: Real-time 3D WebGL visualization of an electric vehicle core powertrain rendered with Three.js.
- **Zero-Latency Tri-Lingual Support (`translations.js`)**: Instant client-side localization across English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी).

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

## 🌐 Production Deployment

Deployed on [Vercel](https://ev-sahayak.vercel.app/).
