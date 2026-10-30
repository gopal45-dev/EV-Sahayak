// Seed dataset for Bengaluru EV Sahayak network
// Coordinates centered around Bengaluru [lng, lat] (77.5946, 12.9716)

export const initialStations = [
  {
    id: "st_1",
    name: "Tata Power EZ Charge - Indiranagar Metro",
    operator: "Tata Power",
    address: "CMH Road, Stage 2, Indiranagar, Bengaluru, 560038",
    landmark: "Near Indiranagar Metro Station Pillar 84",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.6413, 12.9784] },
    connectors: [
      { connectorType: "15A_AC_3PIN", powerKw: 3.3, portsTotal: 4, portsAvailable: 3, pricePerKwh: 15 },
      { connectorType: "TYPE_2", powerKw: 7.4, portsTotal: 2, portsAvailable: 1, pricePerKwh: 18 },
      { connectorType: "CCS2", powerKw: 30, portsTotal: 2, portsAvailable: 0, pricePerKwh: 22 }
    ],
    accessType: "PUBLIC",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-10-27T10:00:00Z",
    source: "AUDITED_OPERATOR",
    is24Hours: true,
    amenities: ["Metro Access", "Cafe Coffee Day", "24/7 Security", "CCTV"],
    rating: 4.7,
    reportsCount: 0
  },
  {
    id: "st_2",
    name: "Ather Grid - Koramangala 5th Block",
    operator: "Ather Grid",
    address: "100 Feet Rd, 5th Block, Koramangala, Bengaluru, 560095",
    landmark: "Opposite Sony World Signal, near Third Wave Coffee",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.6229, 12.9352] },
    connectors: [
      { connectorType: "ATHER_PROPRIETARY", powerKw: 3.3, portsTotal: 2, portsAvailable: 2, pricePerKwh: 0 },
      { connectorType: "15A_AC_3PIN", powerKw: 3.3, portsTotal: 2, portsAvailable: 1, pricePerKwh: 14 }
    ],
    accessType: "PUBLIC",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-10-28T08:30:00Z",
    source: "AUDITED_OPERATOR",
    is24Hours: true,
    amenities: ["Coffee Shop", "Covered Parking", "Air Filling"],
    rating: 4.9,
    reportsCount: 0
  },
  {
    id: "st_3",
    name: "BESCOM EV Fast Charging - MG Road Boulevard",
    operator: "BESCOM",
    address: "Anil Kumble Circle, MG Road, Bengaluru, 560001",
    landmark: "Behind MG Road Utility Building",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.6074, 12.9754] },
    connectors: [
      { connectorType: "15A_AC_3PIN", powerKw: 3.3, portsTotal: 6, portsAvailable: 4, pricePerKwh: 12 },
      { connectorType: "TYPE_2", powerKw: 22, portsTotal: 2, portsAvailable: 1, pricePerKwh: 16 }
    ],
    accessType: "PUBLIC",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-10-25T14:20:00Z",
    source: "AUDITED_OPERATOR",
    is24Hours: true,
    amenities: ["Public Restroom", "Metro Subway", "Sitting Area"],
    rating: 4.3,
    reportsCount: 1
  },
  {
    id: "st_4",
    name: "Bounce Infinity & Sun Mobility Swap Dock - HSR Layout",
    operator: "Sun Mobility & Bounce",
    address: "27th Main Rd, Sector 1, HSR Layout, Bengaluru, 560102",
    landmark: "Near NIFT Campus & Agara Lake Junction",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.6521, 12.9121] },
    connectors: [
      { connectorType: "SWAPPABLE_DOCK", powerKw: 5.0, portsTotal: 12, portsAvailable: 8, pricePerKwh: 65 } // Swap token price
    ],
    accessType: "PUBLIC",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-10-28T11:15:00Z",
    source: "AUDITED_OPERATOR",
    is24Hours: true,
    amenities: ["Instant 60-Sec Battery Swap", "Staff Attendant"],
    rating: 4.8,
    reportsCount: 0
  },
  {
    id: "st_5",
    name: "Jio-bp pulse - Whitefield ITPL Main Rd",
    operator: "Jio-bp",
    address: "Main Rd, Pattandur Agrahara, Whitefield, Bengaluru, 560066",
    landmark: "Next to Prestige Shantiniketan gate",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.7291, 12.9863] },
    connectors: [
      { connectorType: "CCS2", powerKw: 60, portsTotal: 4, portsAvailable: 2, pricePerKwh: 21 },
      { connectorType: "15A_AC_3PIN", powerKw: 3.3, portsTotal: 4, portsAvailable: 3, pricePerKwh: 15 }
    ],
    accessType: "PUBLIC",
    verificationStatus: "VERIFIED",
    lastVerifiedAt: "2026-10-26T18:00:00Z",
    source: "AUDITED_OPERATOR",
    is24Hours: true,
    amenities: ["Wildbean Cafe", "EV Lounge", "Tire Pressure", "Clean Restrooms"],
    rating: 4.6,
    reportsCount: 0
  }
];

export const initialProviders = [
  {
    id: "prov_1",
    displayName: "Ramesh Kumar (QuickEV Assist)",
    phone: "+91 98451 23890",
    maskedPhone: "+91 98451 XXXXX",
    areaName: "Indiranagar & Domlur, Bengaluru",
    location: { type: "Point", coordinates: [77.6387, 12.9698] }, // 1.2 km from Indiranagar
    serviceRadiusKm: 10,
    availabilityStatus: "AVAILABLE",
    verificationLevel: "EQUIPMENT_AUDITED",
    approvalStatus: "APPROVED",
    rating: 4.9,
    completedRescues: 47,
    responseAvgMinutes: 7,
    services: [
      {
        serviceType: "PORTABLE_CHARGER",
        title: "Mobile EV Fast Rescue (3.3kW Portable Charger)",
        description: "Equipped with heavy-duty 3.3kW pure sine portable charger with 15m cable. Works for Ather, Ola, TVS iQube, Chetak & 15A EVs.",
        supportsPortableCharger: true,
        chargerConnectorTypes: ["15A_AC_3PIN", "ATHER_PROPRIETARY", "OLA_HYPER"],
        chargerKwRating: 3.3,
        cableLengthMeters: 15,
        supportsBatterySwap: false,
        batteryModels: [],
        estimatedServicePrice: 249 // INR helper fee
      },
      {
        serviceType: "BATTERY_SWAP",
        title: "Hero Vida & Bounce Infinity Swappable Battery Delivery",
        description: "Carrying 100% charged modular battery packs for Hero Vida V1 and Bounce Infinity E1 riders.",
        supportsBatterySwap: true,
        batteryModels: ["Hero Vida V1", "Bounce Infinity E1"],
        batteryStateOfChargePercent: 98,
        supportsPortableCharger: false,
        estimatedServicePrice: 199
      }
    ]
  },
  {
    id: "prov_2",
    displayName: "Anand's Green Tech Solutions",
    phone: "+91 97312 88419",
    maskedPhone: "+91 97312 XXXXX",
    areaName: "Koramangala & HSR Layout, Bengaluru",
    location: { type: "Point", coordinates: [77.6285, 12.9279] }, // Near Koramangala
    serviceRadiusKm: 12,
    availabilityStatus: "AVAILABLE",
    verificationLevel: "PRO_CERTIFIED",
    approvalStatus: "APPROVED",
    rating: 5.0,
    completedRescues: 62,
    responseAvgMinutes: 6,
    services: [
      {
        serviceType: "PORTABLE_CHARGER",
        title: "Rapid Mobile On-site EV Charging Unit",
        description: "High-capacity mobile inverter pack supporting all Indian electric 2-wheelers. 20-30 min top up gives ~15-20km emergency range.",
        supportsPortableCharger: true,
        chargerConnectorTypes: ["15A_AC_3PIN", "TYPE_2", "ATHER_PROPRIETARY", "OLA_HYPER"],
        chargerKwRating: 3.6,
        cableLengthMeters: 20,
        supportsBatterySwap: false,
        estimatedServicePrice: 299
      }
    ]
  },
  {
    id: "prov_3",
    displayName: "Kiran Gowda (Battery Express)",
    phone: "+91 99014 55672",
    maskedPhone: "+91 99014 XXXXX",
    areaName: "MG Road & Central Bengaluru",
    location: { type: "Point", coordinates: [77.6012, 12.9719] },
    serviceRadiusKm: 8,
    availabilityStatus: "AVAILABLE",
    verificationLevel: "EQUIPMENT_AUDITED",
    approvalStatus: "APPROVED",
    rating: 4.8,
    completedRescues: 29,
    responseAvgMinutes: 9,
    services: [
      {
        serviceType: "BATTERY_SWAP",
        title: "Instant Battery Exchange (Bounce & Sun Mobility compatible)",
        description: "Certified battery swap technician. Direct hot-swap within 3 minutes.",
        supportsBatterySwap: true,
        batteryModels: ["Bounce Infinity E1", "Sun Mobility Standard", "Hero Vida V1"],
        batteryStateOfChargePercent: 95,
        supportsPortableCharger: false,
        estimatedServicePrice: 180
      },
      {
        serviceType: "HOST_SOCKET",
        title: "Protected Shop 16A Dedicated EV Port",
        description: "Ground floor parking slot at MG Road store with 16A industrial socket and water cooler for rider.",
        supportsBatterySwap: false,
        supportsPortableCharger: true,
        chargerConnectorTypes: ["15A_AC_3PIN"],
        chargerKwRating: 3.3,
        estimatedServicePrice: 99
      }
    ]
  }
];

export const initialVehicles = [
  {
    id: "veh_1",
    brand: "Ather",
    modelName: "450X Gen 3",
    variant: "Pro Pack",
    year: 2024,
    batteryCapacityKwh: 3.7,
    connectorType: "ATHER_PROPRIETARY",
    hasSwappableBattery: false,
    batteryPackModel: "Fixed Li-ion 3.7kWh",
    registrationNumber: "KA-01-EV-4509",
    isDefault: true
  },
  {
    id: "veh_2",
    brand: "Ola",
    modelName: "S1 Pro Gen 2",
    variant: "4kWh",
    year: 2024,
    batteryCapacityKwh: 4.0,
    connectorType: "15A_AC_3PIN",
    hasSwappableBattery: false,
    batteryPackModel: "Fixed 4.0kWh",
    registrationNumber: "KA-05-EV-1022",
    isDefault: false
  },
  {
    id: "veh_3",
    brand: "Bounce",
    modelName: "Infinity E1+",
    variant: "Swappable BaaS",
    year: 2023,
    batteryCapacityKwh: 2.0,
    connectorType: "SWAPPABLE_MODULAR",
    hasSwappableBattery: true,
    batteryPackModel: "Bounce Infinity E1",
    registrationNumber: "KA-03-EV-8841",
    isDefault: false
  },
  {
    id: "veh_4",
    brand: "Hero Vida",
    modelName: "V1 Pro",
    variant: "Dual Removable Batteries",
    year: 2024,
    batteryCapacityKwh: 3.94,
    connectorType: "15A_AC_3PIN",
    hasSwappableBattery: true,
    batteryPackModel: "Hero Vida V1",
    registrationNumber: "KA-04-EV-6310",
    isDefault: false
  }
];
