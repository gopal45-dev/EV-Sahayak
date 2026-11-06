# ⚡ EV Sahayak (ಇವಿ ಸಹಾಯಕ / ईवी सहायक)

> **On-Demand Electric Vehicle Roadside Rescue, Verified Public Charging Discovery & Smart Grid Marketplace**  
> *Initial Pilot: Bengaluru Urban & Peripheral EV Corridors (Electric 2-Wheelers & 4-Wheelers)*

[![Live Web App](https://img.shields.io/badge/Live_App-ev--sahayak.vercel.app-facc15?style=flat&logo=vercel&logoColor=black)](https://ev-sahayak.vercel.app/)
[![Production API](https://img.shields.io/badge/Live_API-Render-00d293?style=flat&logo=render&logoColor=white)](https://ev-sahayak-backend.onrender.com/api/stations)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Graphics-Three.js_WebGL-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Geospatial-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

🌐 **Live Application:** [https://ev-sahayak.vercel.app/](https://ev-sahayak.vercel.app/)  
🚀 **Production API:** [https://ev-sahayak-backend.onrender.com/](https://ev-sahayak-backend.onrender.com/)

EV Sahayak is engineered to eliminate range anxiety and unexpected roadside breakdowns for electric vehicle riders in Bengaluru. By combining real-time public charging infrastructure discovery across 43+ verified hubs with a peer-to-peer roadside rescue marketplace, EV riders are never left stranded.

---

## 🌟 Key Features & Architecture

### 1. 🔍 Verified EV Charging Directory & Corridor Planner
* **Real-time Bengaluru Stations**: Browse hundreds of public charging stations across Indiranagar, Koramangala, MG Road, HSR Layout, Whitefield, Electronic City, and outer ring road.
* **Compatibility-Aware Filtering**: Automatically filter by connector compatibility (`15A AC 3-Pin`, `Ather Dot / Fast Grid`, `Ola Hypercharger`, `Hero Vida Modular Dock`, `Type 2`, `CCS2`).
* **Route Corridor Planner (P2)**: Plan commute routes along major Bengaluru corridors (Outer Ring Road, Hosur Highway, Airport Expressway, Mysore Road) with real-time waypoint chargers.
* **BESCOM Real-Time Grid Tariff & Solar Mix**:
  * Live time-of-day dynamic electricity pricing (Off-peak ₹5.50/kWh, Normal ₹7.20/kWh, Peak ₹8.90/kWh).
  * Pavagada Solar Park clean energy mix percentage (44% clean grid feed).
* **One-Click Turn-by-Turn Navigation**: Direct Google Maps routing from live device coordinates.
* **Crowdsourced Station Auditing**: Submit reports for broken/offline chargers, mislocated pins, or missing connectors with admin moderation.

---

### 2. 🚨 Emergency Roadside Assistance (SOS Marketplace)
* **Dual Assistance Rescue Modes**:
  * 🔌 **Mobile 3.3kW Portable Charger Delivery**: Helper arrives with a portable fast-charger and industrial cable to provide 15–20 km of emergency range directly on the spot.
  * 🔋 **Modular Swappable Battery Sharing**: Helper arrives with a fully charged pack for compatible scooters (Hero Vida V1, Bounce Infinity E1, Sun Mobility BaaS) for an instant 3-minute swap.
* **Live GPS Dispatch Radar & Telemetry Tracker**:
  * Simulated real-time helper tracking with live speedometer (28 km/h), distance countdown to breakdown pin, dynamic ETA, and 4-step dispatch status stepper (*Confirmed → En Route → Approaching → Charging*).
* **Server-Side Contact Privacy Shield**:
  * Helper phone numbers remain securely masked and encrypted on the server until access is authorized via a verified Razorpay platform pass.
* **15-Minute Guaranteed SLA Expiry**:
  * Automatic confirmation timers ensure prompt assistance; requests auto-reassign if not accepted within the SLA window.

---

### 3. 🔋 Battery Telemetry & Diagnostics
* **Battery State-of-Health (SOH) & Degradation Estimator**:
  * Calculates real-time battery degradation and retained capacity based on total odometer reading, charge cycles, and Bengaluru's ambient thermal conditions.
  * Monospace telemetry displaying State-of-Health %, cell balance delta (< 11 mV), pack temperature, and remaining lifecycle km.
* **Indian EV Diagnostic Trouble Code (DTC) Decoder**:
  * Self-troubleshooting database for Indian electric scooters:
    * `ATHER-36`: Motor Controller Thermal Threshold
    * `OLA-21`: BMS Contactor High-Voltage Isolation
    * `VIDA-14`: Modular Battery Interlock Sensor
    * `TVS-09`: Charging Port Flap Sensor
  * Provides riders with immediate root cause analysis and actionable 3-step reboot procedures before requesting rescue.
* **Predictive Safe Radius & Range Assessor**:
  * Real-time range calculation across Eco, Normal, and Sport riding modes with low-battery critical warning threshold (< 15%).

---

### 4. 🌐 Tri-Lingual Zero-Latency Interface
* Fully localized in 3 languages without external API latency:
  * **English (`en`)**
  * **Kannada (`kn` / ಕನ್ನಡ)** — Localized for the Bengaluru pilot community
  * **Hindi (`hi` / हिन्दी)**
* Client-side string dictionary architecture in `translations.js` ensures instantaneous language switching across all dashboard cards, navigation, slides, and emergency modals.

---

### 5. 🎮 3D WebGL EV Core Visualizer (Three.js)
* Custom interactive 3D WebGL component rendered with Three.js.
* Displays a rotating, low-latency holographic visualization of an electric vehicle powertrain, energy core, and motor controller.
* Smoothly toggles between Dark Obsidian (`#090d16`) and Royal Blue & Crimson themes.

---

### 6. 🛵 My EV Garage & User Profile
* **Multi-Vehicle Profile Management**: Register and switch between multiple vehicles (Ather 450X, Ola S1 Pro, Hero Vida, TVS iQube, Tata Punch EV).
* **Rescue & Helper History**: Complete audit logs of past rescues, provider names, invoices, and payout settlements.
* **Dispute & Refund Workflow**: Built-in complaint ticketing and automatic platform fee refund credit authorization.
* **Pro Subscription (P1)**: Monthly subscription pass offering unlimited emergency contact unlocks.

---

### 7. 🛡️ Admin Dashboard & Moderation Workspace
* Real-time metrics on registered stations, active helpers, and open emergency requests.
* Interactive moderation queue for user-submitted station inaccuracies and missing charger reports.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Three.js, Lucide Icons, Leaflet / OpenStreetMap |
| **Styling** | Automotive Instrument Design System, Hairline Micro-Borders, Monospace Telemetry |
| **Backend** | Node.js, Express.js RESTful API, CORS, Helmet |
| **Database** | MongoDB with GeoJSON `2dsphere` spatial indexing (`$near`, `$geoWithin`) |
| **Payment Gateway** | Razorpay mock & web checkout verification modal |
| **Localization** | Zero-latency local client-side dictionary (`translations.js`) |

---

## 🔌 Backend REST API Endpoints

### Features & Telemetry (`/api/features`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/features/tariffs` | Real-time BESCOM grid tariffs (Peak/Off-peak) & solar mix |
| `GET` | `/api/features/telemetry/:id` | Live helper GPS dispatch tracking, speed, and ETA |
| `GET` | `/api/features/dtc/:code` | Indian EV Diagnostic Trouble Code lookup |
| `POST` | `/api/features/soh` | Battery degradation & State-of-Health estimator |

### Charging Stations (`/api/stations`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stations` | List all verified stations with geospatial & connector filters |
| `POST` | `/api/stations` | Submit a new charging location for admin review |
| `POST` | `/api/stations/:id/report` | Report station inaccuracy or hardware downtime |

### Emergency Assistance (`/api/assistance`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assistance/request` | Submit location-based assistance request |
| `GET` | `/api/assistance/candidates/:id` | Retrieve nearby helpers with distance and readiness |
| `POST` | `/api/assistance/unlock-contact` | Verify payment and unlock masked helper contact details |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/gopal45-dev/EV-Sahayak.git
cd EV-Sahayak
```

### 2. Start the Backend API
```bash
cd backend
npm install
node src/server.js
# Backend runs at http://localhost:5000
```

### 3. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev -- --host
# Frontend opens at http://localhost:5173
```

---

## 📈 Git & Contribution Guidelines

### How GitHub Contributions Work
GitHub updates your public contribution graph (the green squares) under these criteria:
1. **Matching Email**: The email in your local git commits (`git config user.email`) must match one of the verified email addresses added under **GitHub Settings → Emails**.
2. **Target Branch**: Commits must be made to or merged into the default branch (`main`).
3. **Repository Settings**: For private repositories, enable **"Private contributions"** under your GitHub profile settings to display your activity publicly.
4. **Contribution Types**:
   - Committing and pushing code to `main`
   - Opening issues and reporting bugs
   - Creating and merging pull requests
   - Reviewing code in pull requests

---

## 📄 License
This project is licensed under the MIT License.
