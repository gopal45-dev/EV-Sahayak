# ⚡ EV Sahayak (ईवी सहायक)

> **EV Charging Discovery & On-Demand Roadside Assistance Marketplace**  
> *Initial Pilot Target: Bengaluru, Karnataka (Electric Two-Wheelers)*

EV Sahayak connects stranded electric vehicle riders with nearby charging stations and verified local assistance providers (helpers). Built in strict accordance with the **EV Connect PRD** principles:
> *"Build trust and reliability first, monetise useful access second, and expand only when real usage demonstrates demand."*

---

## 🌟 Key Features

### 1. 🔍 Free EV Charging Discovery (Find EV Charging)
* **Real-time Bengaluru Station Directory**: Search by landmark, area (Indiranagar, Koramangala, MG Road, HSR Layout, Whitefield), or operator.
* **Dual Map & List Interface**: Powered by interactive Leaflet maps with custom station pins.
* **Filter by Connector & Speed**: 15A AC 3-Pin sockets, Ather Dot/Fast Grid, Ola Hypercharger, Sun Mobility & Bounce Swap Docks, Type 2, and CCS2.
* **One-Click GPS Directions**: Open direct Google Maps turn-by-turn navigation using verified coordinates.
* **Community Auditing**: Report broken/offline stations or submit missing charging points for admin vetting.

### 2. 🚨 Emergency Assistance Marketplace (Get Nearby Help)
* **Dual Assistance Modes**:
  * 🔌 **Mobile / Portable Charger Rescue**: Helper arrives with a portable 3.3kW EV charger and heavy-duty 15m cable to give ~15-20km emergency range directly on the spot.
  * 🔋 **Modular Battery Swap / Sharing**: Helper brings a 100% charged modular battery pack compatible with your scooter (Hero Vida V1, Bounce Infinity E1, Sun Mobility BaaS) for an instant 3-minute hot-swap.
* **Real-Time Readiness Countdown**: 15-minute confirmation expiry guarantee per PRD safety standards.
* **Transparent Pricing**:
  * ₹19 Platform Emergency Contact Access Pass.
  * Direct helper on-site service fee displayed upfront with zero hidden charges.
* **Server-Side Phone Number Protection**: Contact details remain encrypted on the server and are only disclosed upon backend payment verification.

### 3. 🤝 Helper Provider Portal (Earn by Helping)
* **Register as a Sahayak Helper**: Turn your portable charger or spare battery packs into earnings.
* **Equipment Specification**: Register charger power rating (kW), cable length, supported vehicle models, and base service fee.
* **Live Availability Toggle**: Go Online/Offline with a single click.

### 4. 🛵 My EV Garage
* Manage multiple electric 2-wheelers (Ather 450X, Ola S1 Pro, Hero Vida V1, Bounce Infinity, TVS iQube, Chetak).
* Track connector types and whether the scooter utilizes a fixed or swappable battery pack.

### 5. 🛡️ Admin Oversight & Moderation
* Live operational statistics across Bengaluru.
* Review and approve/reject community-submitted charging points.
* Track station inaccuracy reports and platform revenue.

---

## 🛠️ Technology Stack (MERN)

* **Database**: MongoDB with GeoJSON `2dsphere` geospatial indexing (`$near`, `$geoWithin`) for spatial queries.
* **Backend**: Node.js & Express RESTful API with server-side phone number masking and payment verification.
* **Frontend**: React (Vite) + Leaflet interactive mapping + Modern Dark EV Glassmorphism UI.
* **Styling**: Tailored design system with Plus Jakarta Sans & Outfit typography.

---

## 🚀 Running Locally

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## 🔒 Git Policy
* **Approval Required**: Commits and pushes are only executed upon explicit user approval.
