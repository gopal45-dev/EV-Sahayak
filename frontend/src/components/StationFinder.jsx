import React, { useState, useEffect } from 'react';
import { 
  Search, Navigation, AlertTriangle, CheckCircle, Clock, Zap, MapPin, 
  Filter, Route, Star, Bike, ChevronRight, Compass, Sun, DollarSign, Leaf 
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function StationFinder({ stations = [], onReportStation, userVehicles = [], theme = 'honeybee' }) {
  const isHoneybee = theme !== 'obsidian';
  const [activeMode, setActiveMode] = useState('browse'); // 'browse' or 'route'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('ALL');
  const [selectedOperator, setSelectedOperator] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // BESCOM Real-Time Dynamic Grid Tariff
  const [bescomTariff, setBescomTariff] = useState({
    zone: 'NORMAL',
    ratePerKwh: '₹7.20',
    solarMixPercent: 44,
    recommendation: 'Standard tariff window: Good grid availability'
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/features/tariffs')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setBescomTariff(data);
        }
      })
      .catch(() => {});
  }, []);

  // Compatibility filter (P0: Compatibility-aware search)
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const activeVehicle = userVehicles[0] || null;

  // Route Corridor Search (P2: Route-based charging)
  const [origin, setOrigin] = useState('Indiranagar');
  const [destination, setDestination] = useState('Electronic City');

  // Form states for station reporting (P0: Station reporting)
  const [reportNotes, setReportNotes] = useState('');
  const [reportIssueType, setReportIssueType] = useState('STATION_OFFLINE');

  // Popular route corridor waypoints in Bengaluru
  const routeCorridors = {
    'Indiranagar-Electronic City': ['Indiranagar', 'Domlur', 'Koramangala', 'HSR Layout', 'Silk Board', 'Electronic City'],
    'Whitefield-MG Road': ['Whitefield', 'Marathahalli', 'HAL Airport Rd', 'Indiranagar', 'MG Road'],
    'Hebbal-Koramangala': ['Hebbal', 'Mekhri Circle', 'Cantonment', 'MG Road', 'Shanthi Nagar', 'Koramangala']
  };

  // Filter logic
  const filteredStations = stations.filter(s => {
    // 1. Text Search
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.landmark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Connector Filter
    const matchesConnector = selectedConnector === 'ALL' ||
      s.connectors.some(c => c.connectorType === selectedConnector);

    // 3. Operator Filter
    const matchesOperator = selectedOperator === 'ALL' ||
      s.operator.toLowerCase().includes(selectedOperator.toLowerCase());

    // 4. Compatibility Filter (P0)
    let matchesCompatibility = true;
    if (onlyCompatible && activeVehicle?.connectorType) {
      matchesCompatibility = s.connectors.some(c => 
        c.connectorType === activeVehicle.connectorType ||
        (activeVehicle.hasSwappableBattery && c.connectorType === 'SWAPPABLE_DOCK')
      );
    }

    // 5. Route corridor filter (P2)
    let matchesRoute = true;
    if (activeMode === 'route') {
      const activeCorridorKey = `${origin}-${destination}`;
      const waypoints = routeCorridors[activeCorridorKey] || [origin, destination];
      matchesRoute = waypoints.some(w => 
        s.address.toLowerCase().includes(w.toLowerCase()) || 
        s.name.toLowerCase().includes(w.toLowerCase()) ||
        s.landmark?.toLowerCase().includes(w.toLowerCase())
      );
    }

    return matchesSearch && matchesConnector && matchesOperator && matchesCompatibility && matchesRoute;
  });

  const handleOpenNav = (coords) => {
    if (!coords) return;
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const submitReport = (e) => {
    e.preventDefault();
    if (!selectedStation) return;
    if (onReportStation) {
      onReportStation(selectedStation.id, reportIssueType, reportNotes);
    }
    setShowReportModal(false);
    setReportNotes('');
    alert('Thank you! Inaccuracy report submitted for administrative review.');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Banner with Navigation & Route Mode Toggle */}
      <div style={{
        background: isHoneybee ? '#ffffff' : '#0f172a',
        border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: isHoneybee ? '3px 3px 0px #000000' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#facc15', border: '1.5px solid #000000', borderRadius: '6px', padding: '6px', display: 'flex', color: '#000000' }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isHoneybee ? '#000000' : '#ffffff' }}>
              Free Bengaluru EV Charging Directory
            </div>
            <div style={{ fontSize: '0.8rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
              Verified network map with real-time port status and turn-by-turn Google Maps navigation.
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Area Search vs Route Corridor */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveMode('browse')}
            className={activeMode === 'browse' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <MapPin size={14} />
            <span>Area Search</span>
          </button>
          <button
            onClick={() => setActiveMode('route')}
            className={activeMode === 'route' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Route size={14} />
            <span>Route Corridor (P2)</span>
          </button>
        </div>
      </div>

      {/* BESCOM Real-Time Dynamic Grid Tariff & Solar Telemetry */}
      <div className="pro-card" style={{
        padding: '12px 18px',
        marginBottom: '16px',
        background: isHoneybee ? '#ffffff' : '#090d16',
        border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#71717a', fontWeight: 600 }}>BESCOM Bengaluru Tariff:</span>
            <span className={`badge-clean ${bescomTariff.zone === 'OFF_PEAK' ? 'badge-green' : (bescomTariff.zone === 'PEAK' ? 'badge-amber' : 'badge-yellow')}`}>
              {bescomTariff.zone} • {bescomTariff.ratePerKwh}/kWh
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#00d293' }}>
            <Leaf size={14} />
            <span>{bescomTariff.solarMixPercent}% Pavagada Clean Solar Feed</span>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {bescomTariff.recommendation}
        </div>
      </div>

      {/* Route Corridor Configuration Card (P2: Route-based charging) */}
      {activeMode === 'route' && (
        <div className="pro-card" style={{ padding: '16px 20px', marginBottom: '20px', background: isHoneybee ? '#fefce8' : '#18181b', border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a', boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Compass size={18} color="#ca8a04" />
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isHoneybee ? '#000000' : '#f4f4f5' }}>
              Highway & Commute Route Corridor Planner
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: isHoneybee ? '#52525b' : '#a1a1aa', marginBottom: '14px' }}>
            Find reliable high-speed charging pitstops along your intended journey without taking long detours.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#71717a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Starting Point</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="input-pro">
                <option value="Indiranagar">Indiranagar</option>
                <option value="Whitefield">Whitefield</option>
                <option value="Hebbal">Hebbal</option>
                <option value="MG Road">MG Road</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#71717a', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Destination</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-pro">
                <option value="Electronic City">Electronic City</option>
                <option value="MG Road">MG Road</option>
                <option value="Koramangala">Koramangala</option>
                <option value="Whitefield">Whitefield</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '8px' }}>
              <span className="badge-clean badge-yellow">Corridor: {origin} → {destination}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar with Compatibility Switch */}
      <div className="pro-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search area (e.g. Indiranagar, Koramangala, Domlur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pro"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Connector Filter */}
          <select
            value={selectedConnector}
            onChange={(e) => setSelectedConnector(e.target.value)}
            className="input-pro"
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">All Connectors & Sockets</option>
            <option value="15A_AC_3PIN">15A AC 3-Pin (Universal 2W)</option>
            <option value="ATHER_PROPRIETARY">Ather Dot / Fast Grid</option>
            <option value="OLA_HYPER">Ola Hypercharger</option>
            <option value="SWAPPABLE_DOCK">Battery Swap Dock (Bounce/Sun)</option>
            <option value="TYPE_2">Type 2 AC</option>
            <option value="CCS2">CCS2 DC Fast</option>
          </select>

          {/* Operator Filter */}
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="input-pro"
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">All Networks & Operators</option>
            <option value="Tata Power">Tata Power EZ</option>
            <option value="Ather Grid">Ather Grid</option>
            <option value="BESCOM">BESCOM Govt</option>
            <option value="Bounce">Bounce & Sun Mobility</option>
            <option value="Jio-bp">Jio-bp pulse</option>
          </select>

          {/* Compatibility Toggle (P0: Compatibility-aware search) */}
          {activeVehicle && (
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: onlyCompatible ? '#00d293' : '#94a3b8',
              cursor: 'pointer',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                checked={onlyCompatible}
                onChange={(e) => setOnlyCompatible(e.target.checked)}
                style={{ accentColor: '#00d293', width: '16px', height: '16px' }}
              />
              <span>Only Compatible with <b>{activeVehicle.brand}</b></span>
            </label>
          )}
        </div>
      </div>

      {/* Main Content Layout: Map + List Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left Column: Station Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
            Showing {filteredStations.length} verified charging locations
          </div>

          {filteredStations.length === 0 ? (
            <div className="pro-card" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
              No stations match the selected criteria. Try adjusting your connector or route corridor.
            </div>
          ) : (
            filteredStations.map(station => {
              const isSelected = selectedStation?.id === station.id;
              const hasSwap = station.connectors.some(c => c.connectorType === 'SWAPPABLE_DOCK');

              return (
                <div
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  className="pro-card pro-card-hover"
                  style={{
                    padding: '16px',
                    borderColor: isSelected ? (isHoneybee ? '#000000' : '#facc15') : (isHoneybee ? '#18181b' : '#27272a'),
                    background: isSelected ? (isHoneybee ? '#fef08a' : '#18181b') : (isHoneybee ? '#ffffff' : '#121215'),
                    cursor: 'pointer',
                    boxShadow: isSelected ? '3px 3px 0px #000000' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#f4f4f5', marginBottom: '2px' }}>
                        {station.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: isHoneybee ? '#52525b' : '#a1a1aa', fontWeight: 600 }}>
                        {station.operator} • {station.city}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge-clean badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={11} fill="#fbbf24" color="#fbbf24" />
                        <span>4.8</span>
                      </span>
                      <span className={`badge-clean ${hasSwap ? 'badge-yellow' : 'badge-green'}`}>
                        {hasSwap ? 'Battery Swap' : station.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: isHoneybee ? '#27272a' : '#d4d4d8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="#71717a" />
                    <span>{station.address}</span>
                  </div>

                  {/* Connectors Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                    {station.connectors.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          background: isHoneybee ? '#fafafa' : '#18181b',
                          border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: isHoneybee ? '#000000' : '#f4f4f5',
                          fontWeight: 700
                        }}
                      >
                        ⚡ {c.connectorType.replace(/_/g, ' ')} ({c.powerKw} kW) • {c.portsAvailable}/{c.portsTotal} avail
                      </span>
                    ))}
                  </div>

                  {/* Actions: Navigation & Report */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Verified: {new Date(station.lastVerifiedAt).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNav(station.location?.coordinates);
                        }}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Navigation size={13} />
                        <span>Directions</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStation(station);
                          setShowReportModal(true);
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        title="Report inaccuracy or outage"
                      >
                        <AlertTriangle size={13} color="#f59e0b" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Leaflet Map */}
        <div className="pro-card" style={{ padding: '10px', height: '680px', display: 'flex', flexDirection: 'column' }}>
          <InteractiveMap
            stations={filteredStations}
            selectedItem={selectedStation}
            onItemSelect={({ data }) => setSelectedStation(data)}
          />
        </div>
      </div>

      {/* Modal: Report Station Issue (P0: Station reporting) */}
      {showReportModal && selectedStation && (
        <div className="modal-overlay">
          <div className="pro-card" style={{ maxWidth: '460px', width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#ffffff' }}>
              Report Inaccuracy
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
              Reporting: <b>{selectedStation.name}</b>
            </p>
            <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Issue Type
                </label>
                <select
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  className="input-pro"
                >
                  <option value="STATION_OFFLINE">Charger / Dock is broken or offline</option>
                  <option value="INCORRECT_LOCATION">Location pin / address is wrong</option>
                  <option value="CONNECTOR_MISMATCH">Connector or plug type differs</option>
                  <option value="PERMANENTLY_CLOSED">Station no longer exists</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Observations & Details
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  rows={3}
                  className="input-pro"
                  placeholder="Provide helpful context for the admin moderation team..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
