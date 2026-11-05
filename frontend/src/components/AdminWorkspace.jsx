import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LogOut, Users, MapPin, DollarSign, Activity, 
  FileText, CheckCircle, RefreshCw, AlertTriangle, Check, X, ShieldAlert,
  CreditCard, Sparkles, Navigation, Clock, Search, ArrowRight, UserCheck, Wrench, Eye
} from 'lucide-react';

export default function AdminWorkspace({ adminUser, onLogout, stations = [], helpers = [], onSwitchToRider, theme = 'honeybee' }) {
  const isHoneybee = theme !== 'obsidian';
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'missions', 'subscriptions', 'stations', 'providers', 'complaints'
  
  // Local state for moderating stations & helpers
  const [stationList, setStationList] = useState(stations);
  const [helperList, setHelperList] = useState(helpers);
  const [stationFilter, setStationFilter] = useState('ALL'); // 'ALL', 'VERIFIED', 'PENDING', 'MAINTENANCE'
  const [subscriptionSearch, setSubscriptionSearch] = useState('');

  // 1. Pro Subscriptions & Recurring Revenue State (Explicit User Requirement)
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'sub_rzp_994101',
      subscriberName: 'Gopal Gupta',
      email: 'guptagopaldilipd@gmail.com',
      phone: '+91 98451 22345',
      planType: 'MONTHLY_PRO',
      planName: 'EV Sahayak Pro Pass (Monthly)',
      amount: 299,
      gatewayRef: 'pay_rzp_sub_994101',
      status: 'ACTIVE',
      date: '01 Nov 2026, 10:00 AM',
      expiryDate: '01 Dec 2026',
      freeUnlocksUsed: 3
    },
    {
      id: 'sub_rzp_883210',
      subscriberName: 'Ananya Rao',
      email: 'ananya.rao@bengaluru.in',
      phone: '+91 98800 77123',
      planType: 'MONTHLY_PRO',
      planName: 'EV Sahayak Pro Pass (Monthly)',
      amount: 299,
      gatewayRef: 'pay_rzp_sub_883210',
      status: 'ACTIVE',
      date: '25 Oct 2026, 02:30 PM',
      expiryDate: '25 Nov 2026',
      freeUnlocksUsed: 6
    },
    {
      id: 'sub_rzp_772109',
      subscriberName: 'Vikram Sundaram',
      email: 'vikram.s@ola-riders.org',
      phone: '+91 97401 55678',
      planType: 'ANNUAL_PRO',
      planName: 'EV Sahayak Fleet Pass (Annual)',
      amount: 2499,
      gatewayRef: 'pay_rzp_sub_772109',
      status: 'ACTIVE',
      date: '15 Sep 2026, 09:15 AM',
      expiryDate: '15 Sep 2027',
      freeUnlocksUsed: 14
    },
    {
      id: 'sub_rzp_661098',
      subscriberName: 'Sneha Patel',
      email: 'sneha.patel@ev.co.in',
      phone: '+91 99160 44321',
      planType: 'MONTHLY_PRO',
      planName: 'EV Sahayak Pro Pass (Monthly)',
      amount: 299,
      gatewayRef: 'pay_rzp_sub_661098',
      status: 'CANCELLED',
      date: '01 Sep 2026, 11:20 AM',
      expiryDate: '01 Oct 2026 (Expired)',
      freeUnlocksUsed: 1
    }
  ]);

  // 2. Live SOS Emergency Missions Mission Control
  const [liveMissions, setLiveMissions] = useState([
    {
      id: 'mission_201',
      riderName: 'Kavita Menon',
      riderPhone: '+91 98450 11223',
      vehicle: 'Ather 450X Gen 3',
      serviceType: 'PORTABLE_CHARGER',
      location: '100 Feet Rd, Indiranagar',
      assignedHelper: 'Ramesh Kumar (QuickEV Assist)',
      status: 'EN_ROUTE',
      distanceKm: 1.4,
      etaMinutes: 5,
      startedAt: '12 mins ago'
    },
    {
      id: 'mission_202',
      riderName: 'Mohammed Zayd',
      riderPhone: '+91 97412 33445',
      vehicle: 'Hero Vida V1 Pro',
      serviceType: 'BATTERY_SWAP',
      location: 'Koramangala 5th Block',
      assignedHelper: 'Sun Mobility / Quick Swap',
      status: 'ARRIVED_ON_SCENE',
      distanceKm: 0.1,
      etaMinutes: 1,
      startedAt: '22 mins ago'
    }
  ]);

  // 3. Moderation complaints & refund queue (P0: Complaint handling, Refund workflow)
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

  // Financial Calculations
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  const mrrInr = activeSubs.reduce((acc, s) => acc + (s.planType === 'ANNUAL_PRO' ? Math.round(s.amount / 12) : s.amount), 0);
  const totalSubRevenue = subscriptions.reduce((acc, s) => acc + s.amount, 0);
  const contactUnlockRevenue = 38 * 19; // 38 unlocked passes
  const helperAuditRevenue = helperList.length * 49; // ₹49 audit fee
  const grossPlatformVolume = totalSubRevenue + contactUnlockRevenue + helperAuditRevenue;

  // Station counts
  const verifiedStationsCount = stationList.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingStationsCount = stationList.filter(s => s.verificationStatus === 'PENDING').length;
  const maintenanceStationsCount = stationList.filter(s => s.verificationStatus === 'MAINTENANCE').length;
  const activeHelpersCount = helperList.filter(h => h.availabilityStatus === 'AVAILABLE').length;

  // Station Status Handlers
  const handleSetStationStatus = (id, newStatus) => {
    setStationList(prev => prev.map(s => s.id === id ? { ...s, verificationStatus: newStatus } : s));
  };

  // Helper Verification Level Handler
  const handleToggleHelperAudit = (id) => {
    setHelperList(prev => prev.map(h => {
      if (h.id === id) {
        const nextLevel = h.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'COMMUNITY_VERIFIED' : 'PHYSICALLY_VERIFIED';
        return { ...h, verificationLevel: nextLevel };
      }
      return h;
    }));
  };

  // Refund Handler
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
    alert(approve ? 'Refund of ₹19 credited back to user account via Razorpay.' : 'Complaint audited and dismissed.');
  };

  // Cancel Subscription Handler
  const handleCancelSubscription = (subId) => {
    if (!window.confirm('Are you sure you want to cancel this user subscription?')) return;
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'CANCELLED' } : s));
  };

  // Filtered station list
  const filteredStations = stationList.filter(s => {
    if (stationFilter === 'ALL') return true;
    return s.verificationStatus === stationFilter;
  });

  // Filtered subscriptions
  const filteredSubscriptions = subscriptions.filter(s => {
    const q = subscriptionSearch.toLowerCase();
    return s.subscriberName.toLowerCase().includes(q) || 
           s.email.toLowerCase().includes(q) || 
           s.gatewayRef.toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: isHoneybee ? '#fafafa' : '#090d16', color: isHoneybee ? '#09090b' : '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Command Bar */}
      <header style={{
        background: isHoneybee ? '#ffffff' : '#0f172a',
        borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
        boxShadow: isHoneybee ? '0 2px 0px rgba(0,0,0,0.06)' : 'none',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff', letterSpacing: '-0.02em' }}>
              EV Sahayak Admin Command Center
            </div>
            <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#854d0e' : '#f59e0b', fontWeight: 600 }}>
              Superadmin: {adminUser?.email || 'guptagopaldilipd@gmail.com'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onSwitchToRider && (
            <button
              onClick={onSwitchToRider}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={14} />
              <span>Switch to Rider View</span>
            </button>
          )}

          <button
            onClick={onLogout}
            style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#dc2626',
              padding: '7px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Console */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '28px 24px', flex: 1 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Activity size={15} />
            <span>Financial & Platform Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={activeTab === 'missions' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Navigation size={15} />
            <span>Live SOS Missions ({liveMissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={activeTab === 'subscriptions' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <CreditCard size={15} />
            <span>Pro Subscriptions & Billing ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={activeTab === 'stations' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <MapPin size={15} />
            <span>Stations Moderation ({stationList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={activeTab === 'providers' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Users size={15} />
            <span>Helper KYC & Equipment ({helperList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <ShieldAlert size={15} />
            <span>Disputes & Refunds ({complaintQueue.filter(c => c.status === 'PENDING_AUDIT').length})</span>
          </button>
        </div>

        {/* TAB 1: FINANCIAL & PLATFORM OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span>Gross Platform Volume (GPV)</span>
                  <DollarSign size={18} color="#00d293" />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#00d293', fontFamily: 'var(--font-mono)' }}>
                  ₹{grossPlatformVolume.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  Unlocks + Helper Audits + Subscriptions
                </div>
              </div>

              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span>Pro Subscriptions MRR</span>
                  <CreditCard size={18} color="#facc15" />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#facc15', fontFamily: 'var(--font-mono)' }}>
                  ₹{mrrInr.toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/mo</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#00d293', marginTop: '4px' }}>
                  {activeSubs.length} active recurring members
                </div>
              </div>

              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span>Active Live Missions</span>
                  <Navigation size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  {liveMissions.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  Ongoing roadside rescues in Bengaluru
                </div>
              </div>

              <div className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span>Charging Stations</span>
                  <MapPin size={18} color="#c084fc" />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {verifiedStationsCount} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {stationList.length}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: pendingStationsCount > 0 ? '#f59e0b' : '#00d293', marginTop: '4px' }}>
                  {pendingStationsCount} pending review • {maintenanceStationsCount} in maintenance
                </div>
              </div>
            </div>

            {/* Quick Overview Triage Split */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {/* Recent Subscription Activity */}
              <div className="pro-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff' }}>Recent Pro Subscribers</h3>
                  <button onClick={() => setActiveTab('subscriptions')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    View All
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {subscriptions.slice(0, 3).map(sub => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isHoneybee ? '#fefce8' : '#090d16', padding: '10px 14px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b' }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isHoneybee ? '#000000' : '#ffffff' }}>{sub.subscriberName}</div>
                        <div style={{ fontSize: '0.72rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{sub.phone} • {sub.planName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#15803d', fontFamily: 'var(--font-mono)' }}>₹{sub.amount}</div>
                        <span className={`badge-clean ${sub.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Rescue Mission Triage */}
              <div className="pro-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff' }}>Ongoing Emergency Rescues</h3>
                  <button onClick={() => setActiveTab('missions')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                    Mission Control
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {liveMissions.map(m => (
                    <div key={m.id} style={{ background: isHoneybee ? '#fefce8' : '#090d16', padding: '12px 14px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isHoneybee ? '#000000' : '#ffffff' }}>{m.riderName} ({m.vehicle})</span>
                        <span className="badge-clean badge-amber" style={{ fontSize: '0.65rem' }}>{m.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                        📍 {m.location} • Rescuer: <b>{m.assignedHelper}</b>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '4px' }}>
                        Live ETA: ~{m.etaMinutes} mins ({m.distanceKm} km away)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE SOS RESCUE MISSION CONTROL */}
        {activeTab === 'missions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 800 }}>Live SOS Emergency Mission Control</h3>
                <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                  Monitor ongoing electric roadside rescues, helper arrival telemetry, and SLA response compliance across Bengaluru.
                </p>
              </div>
              <span className="badge-clean badge-green">LIVE RADAR ACTIVE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
              {liveMissions.map(mission => (
                <div key={mission.id} className="pro-card" style={{ padding: '20px', border: '1.5px solid #18181b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="radar-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d293' }} />
                        <h4 style={{ fontSize: '1.05rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 800 }}>{mission.riderName}</h4>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{mission.riderPhone} • {mission.vehicle}</span>
                    </div>
                    <span className="badge-clean badge-yellow">{mission.status}</span>
                  </div>

                  <div style={{ background: isHoneybee ? '#fefce8' : '#090d16', padding: '12px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.78rem', color: isHoneybee ? '#18181b' : '#cbd5e1' }}>
                      Breakdown Pin: <b>{mission.location}</b>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isHoneybee ? '#854d0e' : '#facc15', fontWeight: 700 }}>
                      Service Required: <b>{mission.serviceType.replace('_', ' ')}</b>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                      Assigned Rescuer: <b>{mission.assignedHelper}</b>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#15803d', fontWeight: 600 }}>
                    <span>ETA: ~{mission.etaMinutes} mins ({mission.distanceKm} km remaining)</span>
                    <button
                      onClick={() => alert(`Radio ping dispatched to ${mission.assignedHelper}. Telemetry verified.`)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    >
                      Ping Rescuer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRO SUBSCRIPTIONS & REVENUE HISTORY (USER REQUIREMENT) */}
        {activeTab === 'subscriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 800 }}>
                  Pro Subscriptions & Payment History
                </h3>
                <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                  Complete audit log of recurring Pro Pass subscribers, Razorpay transactions, and user billing records.
                </p>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search by name, email, or tx ID..."
                  value={subscriptionSearch}
                  onChange={(e) => setSubscriptionSearch(e.target.value)}
                  className="input-pro"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="pro-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: isHoneybee ? '#f4f4f5' : '#090d16', borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b', color: isHoneybee ? '#71717a' : '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '14px 18px' }}>Subscriber</th>
                      <th style={{ padding: '14px 18px' }}>Plan</th>
                      <th style={{ padding: '14px 18px' }}>Amount Paid</th>
                      <th style={{ padding: '14px 18px' }}>Razorpay Payment ID</th>
                      <th style={{ padding: '14px 18px' }}>Subscribed Date</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map(sub => (
                      <tr key={sub.id} style={{ borderBottom: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700, color: isHoneybee ? '#000000' : '#ffffff' }}>{sub.subscriberName}</div>
                          <div style={{ fontSize: '0.72rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{sub.email} • {sub.phone}</div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ color: '#facc15', fontWeight: 700 }}>{sub.planName}</span>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Expires: {sub.expiryDate}</div>
                        </td>
                        <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#00d293' }}>
                          ₹{sub.amount}
                        </td>
                        <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          <code>{sub.gatewayRef}</code>
                        </td>
                        <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                          {sub.date}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span className={`badge-clean ${sub.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          {sub.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleCancelSubscription(sub.id)}
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#dc2626' }}
                            >
                              Cancel Pass
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Cancelled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHARGING STATIONS MODERATION (P0) */}
        {activeTab === 'stations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 800 }}>
                  Charging Directory Moderation
                </h3>
                <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                  Manage verified status, put faulty hardware into maintenance, and review community-submitted charging points.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'VERIFIED', 'PENDING', 'MAINTENANCE'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStationFilter(st)}
                    style={{
                      background: stationFilter === st ? '#facc15' : (isHoneybee ? '#ffffff' : '#090d16'),
                      color: stationFilter === st ? '#000000' : (isHoneybee ? '#52525b' : '#94a3b8'),
                      border: stationFilter === st ? '1.5px solid #000000' : (isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b'),
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredStations.map(st => (
                <div key={st.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 700 }}>{st.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{st.operator} • {st.city}</span>
                    </div>
                    <span className={`badge-clean ${st.verificationStatus === 'VERIFIED' ? 'badge-green' : (st.verificationStatus === 'MAINTENANCE' ? 'badge-amber' : 'badge-yellow')}`}>
                      {st.verificationStatus}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: isHoneybee ? '#27272a' : '#cbd5e1', marginBottom: '12px' }}>
                    {st.address}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.72rem', color: isHoneybee ? '#71717a' : '#64748b' }}>
                      Connectors: {st.connectors?.length || 1} ports
                    </span>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {st.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => handleSetStationStatus(st.id, 'VERIFIED')}
                          className="btn-primary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          Verify
                        </button>
                      )}
                      {st.verificationStatus !== 'MAINTENANCE' && (
                        <button
                          onClick={() => handleSetStationStatus(st.id, 'MAINTENANCE')}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#f59e0b' }}
                        >
                          Set Maintenance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: HELPER KYC & EQUIPMENT AUDIT (P0) */}
        {activeTab === 'providers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>Helper KYC & Equipment Audit Moderation</h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Verify peer helper equipment (portable 3.3kW charger, cable rating, battery packs) to grant official Sahayak certification.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {helperList.map(hlp => (
                <div key={hlp.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 700 }}>{hlp.displayName}</h4>
                      <span style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{hlp.areaName} ({hlp.serviceRadiusKm} km coverage)</span>
                    </div>
                    <span className={`badge-clean ${hlp.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'badge-green' : 'badge-yellow'}`}>
                      {hlp.verificationLevel}
                    </span>
                  </div>

                  <div style={{ background: isHoneybee ? '#fefce8' : '#090d16', padding: '10px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b', fontSize: '0.75rem', color: isHoneybee ? '#18181b' : '#cbd5e1', marginBottom: '12px' }}>
                    <div>Phone: <b>+91 {hlp.phone}</b></div>
                    <div>Rescues Completed: <b>{hlp.completedRescues || 0}</b> • Rating: ⭐ {hlp.rating}</div>
                    <div style={{ color: '#15803d', marginTop: '2px', fontWeight: 600 }}>Equipment: 3.3kW Portable Charger + 15m Extension Verified</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b' }}>
                    <button
                      onClick={() => handleToggleHelperAudit(hlp.id)}
                      className="btn-secondary"
                      style={{ padding: '5px 12px', fontSize: '0.72rem' }}
                    >
                      {hlp.verificationLevel === 'PHYSICALLY_VERIFIED' ? 'Demote to Community Audit' : 'Upgrade to Physical Audit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DISPUTES & REFUND QUEUE (P0) */}
        {activeTab === 'complaints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 800 }}>Rider Disputes & Automatic Refund Queue</h3>
              <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                Review filed complaints for helper no-shows or equipment mismatch. Authorize instant ₹19 Razorpay refunds.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaintQueue.map(c => (
                <div key={c.id} className="pro-card" style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', color: isHoneybee ? '#000000' : '#ffffff', fontWeight: 700 }}>Ticket #{c.id}: {c.riderName}</h4>
                        <span className="badge-clean badge-amber">{c.reason}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8', marginTop: '2px' }}>
                        Against Rescuer: <b>{c.providerName}</b> • {c.timestamp}
                      </div>
                    </div>
                    <span className={`badge-clean ${c.status === 'REFUND_APPROVED' ? 'badge-green' : 'badge-amber'}`}>
                      {c.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#18181b' : '#cbd5e1', background: isHoneybee ? '#fefce8' : '#090d16', border: isHoneybee ? '1.5px solid #18181b' : 'none', padding: '10px 12px', borderRadius: '8px', margin: '10px 0' }}>
                    "{c.details}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b' }}>
                    <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      Claim Amount: {c.amount}
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
                      <span style={{ fontSize: '0.75rem', color: '#00d293', fontWeight: 600 }}>
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
