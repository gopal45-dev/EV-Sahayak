import React, { useState } from 'react';
import { Search, Navigation, AlertTriangle, CheckCircle, Clock, Zap, MapPin, Filter, ExternalLink } from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function StationFinder({ stations = [], onReportStation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('ALL');
  const [selectedOperator, setSelectedOperator] = useState('ALL');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form states
  const [reportNotes, setReportNotes] = useState('');
  const [reportIssueType, setReportIssueType] = useState('STATION_OFFLINE');

  // Filter logic
  const filteredStations = stations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.landmark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesConnector = selectedConnector === 'ALL' ||
      s.connectors.some(c => c.connectorType === selectedConnector);

    const matchesOperator = selectedOperator === 'ALL' ||
      s.operator.toLowerCase().includes(selectedOperator.toLowerCase());

    return matchesSearch && matchesConnector && matchesOperator;
  });

  const handleOpenNav = (coords) => {
    if (!coords) return;
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const submitReport = (e) => {
    e.preventDefault();
    if (!selectedStation) return;
    onReportStation(selectedStation.id, reportIssueType, reportNotes);
    setShowReportModal(false);
    setReportNotes('');
    alert('Thank you! Inaccuracy report submitted for administrative review.');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Top Banner */}
      <div style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2563eb', borderRadius: '8px', padding: '6px', display: 'flex', color: '#ffffff' }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
              Free Bengaluru EV Charging Directory
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Public search and turn-by-turn navigation are 100% free with no account required per PRD Module B.
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 210, 147, 0.1)',
          border: '1px solid rgba(0, 210, 147, 0.3)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          color: '#00d293',
          fontWeight: 600
        }}>
          <CheckCircle size={15} color="#00d293" />
          <span>Verified Network Directory</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="pro-card" style={{ padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search area (e.g., Indiranagar, Koramangala, MG Road)..."
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
        </div>
      </div>

      {/* Main Content Layout: Map + List Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left Column: Station Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
            Showing {filteredStations.length} charging locations
          </div>

          {filteredStations.map(station => {
            const isSelected = selectedStation?.id === station.id;
            const hasSwap = station.connectors.some(c => c.connectorType === 'SWAPPABLE_DOCK');

            return (
              <div
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className="pro-card pro-card-hover"
                style={{
                  padding: '16px',
                  borderColor: isSelected ? '#3b82f6' : '#1e293b',
                  background: isSelected ? '#0f1a33' : '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '2px' }}>
                      {station.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {station.operator} • {station.city}
                    </div>
                  </div>
                  <span className={`badge-clean ${hasSwap ? 'badge-blue' : 'badge-green'}`}>
                    {hasSwap ? 'Battery Swap' : station.verificationStatus}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color="#64748b" />
                  <span>{station.address}</span>
                </div>

                {/* Connectors Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {station.connectors.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        background: '#090d16',
                        border: '1px solid #1e293b',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontWeight: 600
                      }}
                    >
                      ⚡ {c.connectorType.replace(/_/g, ' ')} ({c.powerKw} kW) • {c.portsAvailable}/{c.portsTotal} avail
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #1e293b' }}>
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
                      title="Report issue"
                    >
                      <AlertTriangle size={13} color="#f59e0b" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Modal: Report Station Issue */}
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
                  placeholder="Provide helpful context for the admin audit team..."
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
