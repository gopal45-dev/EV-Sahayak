import React, { useState } from 'react';
import { 
  ShieldCheck, Check, X, AlertTriangle, Users, MapPin, 
  DollarSign, Lock, ArrowRight, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboard({ stations = [], helpers = [], onVerifyStation, currentUser, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('stations'); // 'stations', 'helpers', 'reports'

  // Access Control Enforcement
  const isAdmin = currentUser?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '580px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="pro-card" style={{ padding: '36px 28px', border: '1px solid #334155' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock size={28} />
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px' }}>
            Restricted Administrator Portal
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '24px' }}>
            This section is protected by role-based access control (RBAC per PRD Section 6.7). Only authorized EV Sahayak platform administrators can review submitted stations, inspect helper audits, and handle customer dispute reports.
          </p>

          <button
            onClick={() => onOpenAuth('ADMIN')}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <ShieldCheck size={16} />
            <span>Sign In as Platform Administrator</span>
          </button>
        </div>
      </div>
    );
  }

  const totalStations = stations.length;
  const verifiedStations = stations.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingStations = stations.filter(s => s.verificationStatus === 'PENDING').length;

  const totalHelpers = helpers.length;
  const onlineHelpers = helpers.filter(h => h.availabilityStatus === 'AVAILABLE').length;
  const swapHelpers = helpers.filter(h => h.services?.some(s => s.serviceType === 'BATTERY_SWAP')).length;
  const chargerHelpers = helpers.filter(h => h.services?.some(s => s.serviceType === 'PORTABLE_CHARGER')).length;

  const sampleReports = [
    {
      id: 'rep_101',
      stationName: 'BESCOM EV Fast Charging - MG Road Boulevard',
      issueType: 'CONNECTOR_FAULT',
      notes: '15A port 2 socket is cracked and tripped.',
      status: 'PENDING_REVIEW',
      reportedAt: '1 hour ago'
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-clean badge-amber">OPERATIONAL OVERSIGHT</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Logged in as {currentUser.name}</span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff' }}>
            EV Sahayak Platform Moderation
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('stations')}
            className={activeTab === 'stations' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem' }}
          >
            Stations ({stations.length})
          </button>
          <button
            onClick={() => setActiveTab('helpers')}
            className={activeTab === 'helpers' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem' }}
          >
            Helpers ({helpers.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem' }}
          >
            Inaccuracy Reports (1)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div className="pro-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Verified Stations</span>
            <MapPin size={16} color="#00d293" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
            {verifiedStations} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/ {totalStations}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: pendingStations > 0 ? '#f59e0b' : '#00d293', marginTop: '4px' }}>
            {pendingStations} pending approval
          </div>
        </div>

        <div className="pro-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Active Sahayak Helpers</span>
            <Users size={16} color="#facc15" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
            {onlineHelpers} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>Online</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            ⚡ {chargerHelpers} Charger • 🔋 {swapHelpers} Swap
          </div>
        </div>

        <div className="pro-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>Pass Model (Razorpay)</span>
            <DollarSign size={16} color="#facc15" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
            ₹19 <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>/ rescue pass</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#00d293', marginTop: '4px' }}>
            ₹49 helper onboarding pass
          </div>
        </div>
      </div>

      {/* STATIONS TAB */}
      {activeTab === 'stations' && (
        <div className="pro-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '14px' }}>
            Bengaluru Station Registry & Audit Queue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stations.map(station => {
              const isPending = station.verificationStatus === 'PENDING';

              return (
                <div
                  key={station.id}
                  style={{
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                        {station.name}
                      </span>
                      <span className={`badge-clean ${isPending ? 'badge-amber' : 'badge-green'}`}>
                        {station.verificationStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
                      {station.address} • Operator: {station.operator} • Source: {station.source}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isPending ? (
                      <>
                        <button
                          onClick={() => onVerifyStation(station.id, 'VERIFIED')}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <Check size={14} /> Approve Station
                        </button>
                        <button
                          onClick={() => onVerifyStation(station.id, 'REJECTED')}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#f87171' }}
                        >
                          <X size={14} /> Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#00d293', fontWeight: 600 }}>
                        ✓ Vetted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HELPERS TAB */}
      {activeTab === 'helpers' && (
        <div className="pro-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '14px' }}>
            Registered Sahayak Providers Directory
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {helpers.map(helper => (
              <div
                key={helper.id}
                style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                    {helper.displayName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {helper.areaName} • {helper.phone} • ⭐ {helper.rating} ({helper.completedRescues} rescues)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="badge-clean badge-green">{helper.verificationLevel}</span>
                  <span className="badge-clean badge-yellow">{helper.approvalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="pro-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '14px' }}>
            User Reported Station Issues
          </h3>
          {sampleReports.map(rep => (
            <div
              key={rep.id}
              style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                  {rep.stationName}
                </div>
                <span className="badge-clean badge-amber">{rep.issueType}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '8px' }}>
                "{rep.notes}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Reported {rep.reportedAt} • Status: {rep.status}
                </span>
                <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
