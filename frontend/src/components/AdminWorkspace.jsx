import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, Users, MapPin, DollarSign, Activity, 
  FileText, CheckCircle, RefreshCw, AlertTriangle, Check, X, ShieldAlert 
} from 'lucide-react';

export default function AdminWorkspace({ adminUser, onLogout, stations = [], helpers = [] }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'stations', 'providers', 'complaints'
  
  // Local state for moderating stations
  const [stationList, setStationList] = useState(stations);
  const [helperList, setHelperList] = useState(helpers);

  // Moderation complaints & refund queue (P0: Complaint handling, Refund workflow)
  const [complaintQueue, setComplaintQueue] = useState([
    {
      id: 'cmp_1001',
      riderName: 'Vikram Sundaram',
      providerName: 'Ramesh Kumar (QuickEV Assist)',
      reason: 'PROVIDER_NO_SHOW',
      details: 'Helper accepted but was delayed past 30 mins due to traffic.',
      amount: '₹19.00',
      status: 'PENDING_AUDIT',
      timestamp: 'Today, 10:14 AM'
    },
    {
      id: 'cmp_1002',
      riderName: 'Sneha Patel',
      providerName: 'Sun Mobility / Quick Swap',
      reason: 'INCORRECT_EQUIPMENT',
      details: 'Battery pack variant was incompatible with Ather 450X fixed chassis.',
      amount: '₹19.00',
      status: 'REFUND_APPROVED',
      timestamp: 'Yesterday, 04:22 PM'
    }
  ]);

  const verifiedStationsCount = stationList.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingStationsCount = stationList.filter(s => s.verificationStatus === 'PENDING').length;
  const activeHelpersCount = helperList.filter(h => h.availabilityStatus === 'AVAILABLE').length;

  const handleApproveStation = (id) => {
    setStationList(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: 'VERIFIED' } : s));
  };

  const handleToggleHelperAudit = (id) => {
    setHelperList(prev => prev.map(h => {
      if (h.id === id) {
        const nextLevel = h.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'COMMUNITY_VERIFIED' : 'PHYSICALLY_VERIFIED';
        return { ...h, verificationLevel: nextLevel };
      }
      return h;
    }));
  };

  const handleProcessRefund = (complaintId, approve) => {
    setComplaintQueue(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: approve ? 'REFUND_APPROVED' : 'REJECTED',
          resolvedAt: new Date().toLocaleTimeString()
        };
      }
      return c;
    }));
    alert(approve ? 'Refund of ₹19 credited back to user via Razorpay gateway.' : 'Complaint audited and dismissed.');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Bar */}
      <header style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              EV Sahayak Admin Workspace
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
              Designated Superadmin: {adminUser?.email || 'guptagopaldilipd@gmail.com'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-clean badge-amber">ROOT PRIVILEGES</span>
          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '32px 24px', flex: 1 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Activity size={15} />
            <span>Overview & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={activeTab === 'stations' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <MapPin size={15} />
            <span>Moderate Stations ({stationList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={activeTab === 'providers' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Users size={15} />
            <span>Moderate Providers ({helperList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem', position: 'relative' }}
          >
            <ShieldAlert size={15} />
            <span>Complaints & Refunds ({complaintQueue.filter(c => c.status === 'PENDING_AUDIT').length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '14px',
              padding: '18px 24px',
              marginBottom: '28px'
            }}>
              <h2 style={{ fontSize: '1.25rem', color: '#fbbf24', marginBottom: '4px' }}>
                Central Superadmin Moderation Console
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
                Manage verified charging locations, community helpers, roadside request logs, and customer refund disputes.
              </p>
            </div>

            {/* Real-Time Platform Status Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Verified Charging Locations</span>
                  <MapPin size={18} color="#00d293" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
                  {verifiedStationsCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/ {stationList.length}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: pendingStationsCount > 0 ? '#f59e0b' : '#00d293', marginTop: '4px' }}>
                  {pendingStationsCount} pending approval
                </div>
              </div>

              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Registered Sahayak Providers</span>
                  <Users size={18} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeHelpersCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>Available</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  Total Network: {helperList.length} registered helpers
                </div>
              </div>

              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Razorpay Revenue Gateway</span>
                  <DollarSign size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
                  Active
                </div>
                <div style={{ fontSize: '0.75rem', color: '#00d293', marginTop: '4px' }}>
                  ₹19 Contact Pass + ₹49 Helper Audit
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODERATE STATIONS (P0: Moderate stations) */}
        {activeTab === 'stations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Directory Charging Stations Moderation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {stationList.map(st => (
                <div key={st.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{st.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{st.operator} • {st.city}</span>
                    </div>
                    <span className={`badge-clean ${st.verificationStatus === 'VERIFIED' ? 'badge-green' : 'badge-amber'}`}>
                      {st.verificationStatus}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '12px' }}>
                    {st.address}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Coords: {st.location?.coordinates?.[1]}, {st.location?.coordinates?.[0]}
                    </span>
                    {st.verificationStatus === 'PENDING' && (
                      <button
                        onClick={() => handleApproveStation(st.id)}
                        className="btn-primary"
                        style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                      >
                        Approve & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MODERATE PROVIDERS (P0: Moderate providers) */}
        {activeTab === 'providers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Helper & Equipment Audit Moderation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {helperList.map(hlp => (
                <div key={hlp.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{hlp.displayName}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hlp.areaName} ({hlp.serviceRadiusKm} km)</span>
                    </div>
                    <span className={`badge-clean ${hlp.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'badge-green' : 'badge-blue'}`}>
                      {hlp.verificationLevel}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '12px' }}>
                    Phone: +91 {hlp.phone} • Rescues: {hlp.completedRescues || 0} • Rating: ⭐ {hlp.rating}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                    <button
                      onClick={() => handleToggleHelperAudit(hlp.id)}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                    >
                      {hlp.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'Demote to Community' : 'Upgrade to Physical Audit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMPLAINTS & REFUNDS QUEUE (P0: Complaint handling, Refund workflow) */}
        {activeTab === 'complaints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Rider Disputes & Automatic Refund Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaintQueue.map(c => (
                <div key={c.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Ticket #{c.id}: {c.riderName}</h4>
                        <span className="badge-clean badge-amber">{c.reason}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        Against Helper: <b>{c.providerName}</b> • {c.timestamp}
                      </div>
                    </div>
                    <span className={`badge-clean ${c.status === 'REFUND_APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                      {c.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', background: '#090d16', padding: '10px 12px', borderRadius: '8px', margin: '10px 0' }}>
                    "{c.details}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                      Refund Claim: {c.amount}
                    </span>

                    {c.status === 'PENDING_AUDIT' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleProcessRefund(c.id, false)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <X size={13} />
                          <span>Dismiss</span>
                        </button>
                        <button
                          onClick={() => handleProcessRefund(c.id, true)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#059669' }}
                        >
                          <Check size={13} />
                          <span>Approve ₹19 Refund</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#00d293' }}>
                        Resolved & Handled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
