import React, { useState } from 'react';
import { 
  HeartHandshake, BatteryCharging, Zap, MapPin, ShieldCheck, 
  Power, Plus, CheckCircle2, Lock, ArrowRight, UserCheck, 
  TrendingUp, Activity, Clock, Check, X, BellRing, DollarSign, Award 
} from 'lucide-react';
import RazorpayModal from './RazorpayModal';

export default function HelperPortal({ helpers = [], onRegisterHelper, onToggleStatus, currentUser }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'register', 'requests', 'analytics'
  
  // Registration Form (P0: Provider registration & equipment listing)
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
  const [area, setArea] = useState('Indiranagar, Bengaluru');
  const [radiusKm, setRadiusKm] = useState(8);
  
  // Assistance Capabilities & Equipment Details
  const [offerPortableCharger, setOfferPortableCharger] = useState(true);
  const [chargerKw, setChargerKw] = useState(3.3);
  const [chargerPrice, setChargerPrice] = useState(250);

  const [offerBatterySwap, setOfferBatterySwap] = useState(false);
  const [batteryModels, setBatteryModels] = useState('Hero Vida V1, Bounce Infinity E1');
  const [batteryPrice, setBatteryPrice] = useState(199);

  // Razorpay for Helper Registration Fee (₹49)
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [pendingHelperData, setPendingHelperData] = useState(null);

  // Live incoming rescue dispatch requests queue (P0: Provider responses)
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'req_live_701',
      riderName: 'Arun K.',
      vehicle: 'Ather 450X (Ather Proprietary)',
      batteryPercent: 6,
      distanceKm: 1.8,
      locationAddress: 'Near Indiranagar Metro, 100ft Rd',
      serviceType: 'PORTABLE_CHARGER',
      proposedPrice: 249,
      timestamp: '2 mins ago',
      status: 'PENDING' // 'PENDING', 'ACCEPTED', 'DECLINED'
    },
    {
      id: 'req_live_702',
      riderName: 'Pooja Sharma',
      vehicle: 'Hero Vida V1 (Modular Swappable)',
      batteryPercent: 4,
      distanceKm: 3.2,
      locationAddress: 'Old Airport Road, Domlur Flyover',
      serviceType: 'BATTERY_SWAP',
      proposedPrice: 199,
      timestamp: '6 mins ago',
      status: 'PENDING'
    }
  ]);

  const handleRequestResponse = (requestId, action) => {
    setIncomingRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED',
          confirmedAt: new Date().toLocaleTimeString()
        };
      }
      return req;
    }));

    if (action === 'ACCEPT') {
      alert('Readiness confirmed! Your arrival confirmation and price lock have been timestamped.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Mobile number must be exactly 10 numeric digits.');
      return;
    }

    const services = [];
    if (offerPortableCharger) {
      services.push({
        serviceType: 'PORTABLE_CHARGER',
        title: `Mobile ${chargerKw}kW Portable Charger Rescue`,
        description: 'Heavy-duty pure sine mobile charger with 15m cable.',
        chargerConnectorTypes: ['15A_AC_3PIN', 'ATHER_PROPRIETARY', 'OLA_HYPER'],
        chargerKwRating: Number(chargerKw),
        cableLengthMeters: 15,
        estimatedServicePrice: Number(chargerPrice)
      });
    }

    if (offerBatterySwap) {
      services.push({
        serviceType: 'BATTERY_SWAP',
        title: 'Modular Battery Swap & Delivery',
        description: `Delivering 100% charged battery pack for: ${batteryModels}`,
        batteryModels: batteryModels.split(',').map(s => s.trim()),
        batteryStateOfChargePercent: 98,
        estimatedServicePrice: Number(batteryPrice)
      });
    }

    if (services.length === 0) {
      alert('Please select at least one rescue service: Portable Charger or Battery Swap!');
      return;
    }

    const payload = {
      displayName: name,
      phone,
      ownerId: currentUser?.phone || currentUser?.name || phone,
      areaName: area,
      serviceRadiusKm: Number(radiusKm),
      services
    };

    setPendingHelperData(payload);
    setShowRazorpay(true);
  };

  const handleRazorpaySuccess = (paymentDetails) => {
    setShowRazorpay(false);
    if (pendingHelperData) {
      onRegisterHelper({
        ...pendingHelperData,
        paymentGatewayRef: paymentDetails.paymentId,
        membershipActive: true
      });
      alert(`Payment of ₹49 verified via Razorpay (${paymentDetails.paymentId})! Your Helper profile is now active.`);
      setActiveTab('browse');
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-clean badge-green">SAHAYAK PROVIDER NETWORK</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bengaluru Helper & Dispatch Portal</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '6px' }}>
              Earn by Rescuing Stranded EV Riders
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '640px' }}>
              List your portable charger or swappable batteries to receive paid roadside rescue requests. Manage dispatch, responses, and earnings.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              className={activeTab === 'browse' ? 'btn-primary' : 'btn-secondary'}
            >
              Browse Helpers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}
              style={{ position: 'relative' }}
            >
              <BellRing size={15} />
              <span>Rescue Requests</span>
              {incomingRequests.some(r => r.status === 'PENDING') && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}
            >
              <TrendingUp size={15} />
              <span>Provider Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}
            >
              <Plus size={15} />
              <span>List Equipment</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BROWSE ALL REGISTERED HELPERS */}
      {activeTab === 'browse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {helpers.map(helper => {
            const isOnline = helper.availabilityStatus === 'AVAILABLE';
            const isOwner = currentUser && (
              helper.ownerId === currentUser.phone || 
              helper.ownerId === currentUser.name ||
              helper.phone === currentUser.phone ||
              helper.displayName === currentUser.name
            );

            return (
              <div key={helper.id} className="pro-card" style={{ padding: '20px', borderColor: isOwner ? '#3b82f6' : '#1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                        {helper.displayName}
                      </h3>
                      {isOwner && (
                        <span className="badge-clean badge-blue" style={{ fontSize: '0.65rem' }}>
                          <UserCheck size={10} /> My Listing
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={13} />
                      <span>{helper.areaName} ({helper.serviceRadiusKm} km radius)</span>
                    </div>
                  </div>
                  <span className={`badge-clean ${isOnline ? 'badge-green' : 'badge-amber'}`}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#00d293' : '#f59e0b' }}></span>
                    {helper.availabilityStatus}
                  </span>
                </div>

                {/* Services Offered */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0' }}>
                  {helper.services?.map((svc, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#090d16',
                        border: '1px solid #1e293b',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {svc.serviceType === 'BATTERY_SWAP' ? <BatteryCharging size={14} color="#00d293" /> : <Zap size={14} color="#38bdf8" />}
                          <span>{svc.title}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          {svc.serviceType === 'BATTERY_SWAP' 
                            ? `Modular Battery: ${svc.batteryModels?.join(', ')}`
                            : `Power: ${svc.chargerKwRating}kW • Reach: ${svc.cableLengthMeters}m`}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Service Fee</div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                          ₹{svc.estimatedServicePrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #1e293b',
                  fontSize: '0.78rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="#00d293" />
                    <span>{helper.verificationLevel?.replace('_', ' ') || 'COMMUNITY VERIFIED'}</span>
                  </div>
                  <div>
                    ⭐ <b>{helper.rating}</b> ({helper.completedRescues || 12} rescues)
                  </div>
                </div>

                {/* Availability Toggle */}
                {isOwner && onToggleStatus && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #334155' }}>
                    <button
                      onClick={() => onToggleStatus(helper.id)}
                      className={isOnline ? 'btn-secondary' : 'btn-primary'}
                      style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
                    >
                      <Power size={14} />
                      <span>{isOnline ? 'Go Offline (Pause Requests)' : 'Go Online (Accept Rescues)'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INCOMING RESCUE REQUESTS (P0: Provider responses) */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="pro-card" style={{ padding: '16px 20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#38bdf8', marginBottom: '4px' }}>
              Real-Time Rescue Dispatch Queue
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Confirm your readiness within 15 minutes to lock in the job and notify the rider.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {incomingRequests.map(req => (
              <div key={req.id} className="pro-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>{req.riderName}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{req.vehicle}</span>
                  </div>
                  <span className={`badge-clean ${req.status === 'ACCEPTED' ? 'badge-green' : (req.status === 'DECLINED' ? 'badge-amber' : 'badge-blue')}`}>
                    {req.status}
                  </span>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#64748b" />
                    <span>{req.locationAddress} ({req.distanceKm} km away)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BatteryCharging size={14} color="#f43f5e" />
                    <span>Battery Critical: <b>{req.batteryPercent}% Remaining</b></span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#00d293', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} />
                    <span>Payout: ₹{req.proposedPrice}</span>
                  </div>
                </div>

                {req.status === 'PENDING' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      onClick={() => handleRequestResponse(req.id, 'DECLINE')}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '8px' }}
                    >
                      <X size={14} />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleRequestResponse(req.id, 'ACCEPT')}
                      className="btn-primary"
                      style={{ fontSize: '0.8rem', padding: '8px' }}
                    >
                      <Check size={14} />
                      <span>Accept & Confirm</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                    Response logged at {req.confirmedAt || 'just now'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROVIDER ANALYTICS (P1: Provider analytics) */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="pro-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Acceptance Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00d293' }}>96.4%</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Top 5% provider in Bengaluru</div>
            </div>

            <div className="pro-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Avg Response Time</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>8.2 mins</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Within 15-min PRD benchmark</div>
            </div>

            <div className="pro-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Total Rescues</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>38</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>100% resolution success</div>
            </div>

            <div className="pro-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>Settled Earnings</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>₹8,450</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Direct UPI settlement</div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="pro-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px' }}>
              Dispatch Activity & Ratings Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '10px' }}>
                  Customer Ratings Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>5 Stars (Excellent speed)</span>
                    <span style={{ color: '#00d293', fontWeight: 700 }}>34 (89%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>4 Stars (Good service)</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>4 (11%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>Below 3 Stars</span>
                    <span style={{ color: '#64748b', fontWeight: 700 }}>0 (0%)</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '10px' }}>
                  Most Frequent Rescue Hubs
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>Indiranagar & 100ft Rd</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>18 rescues</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>Domlur & Old Airport Rd</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>12 rescues</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <span>Koramangala 4th Block</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>8 rescues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTER & LIST EQUIPMENT */}
      {activeTab === 'register' && (
        <div className="pro-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '28px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '6px' }}>
            List Your Rescue Equipment
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: '22px' }}>
            Earn money providing portable EV charging or battery swap deliveries in your neighborhood.
          </p>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Your Name / Service Brand
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar (QuickEV Assist)"
                required
                className="input-pro"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Mobile Number (10 numeric digits)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9845123456"
                required
                maxLength={10}
                className="input-pro"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Primary Base Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  required
                  className="input-pro"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Radius (km)
                </label>
                <input
                  type="number"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  min={1}
                  max={25}
                  required
                  className="input-pro"
                />
              </div>
            </div>

            {/* Assistance Services Offerings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
              {/* Service 1: Portable Charger */}
              <div style={{
                background: offerPortableCharger ? 'rgba(37, 99, 235, 0.1)' : '#090d16',
                border: offerPortableCharger ? '1px solid #2563eb' : '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: offerPortableCharger ? '10px' : '0' }}>
                  <input
                    type="checkbox"
                    checked={offerPortableCharger}
                    onChange={(e) => setOfferPortableCharger(e.target.checked)}
                    style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>
                    ⚡ I offer Portable Charger Rescue
                  </span>
                </label>

                {offerPortableCharger && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Charger Power (kW)</span>
                      <select
                        value={chargerKw}
                        onChange={(e) => setChargerKw(e.target.value)}
                        className="input-pro"
                      >
                        <option value={3.3}>3.3 kW (Standard)</option>
                        <option value={7.4}>7.4 kW (Fast)</option>
                        <option value={11}>11 kW (Heavy-duty)</option>
                      </select>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Your Service Fee (₹)</span>
                      <input
                        type="number"
                        value={chargerPrice}
                        onChange={(e) => setChargerPrice(e.target.value)}
                        className="input-pro"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Service 2: Battery Swap */}
              <div style={{
                background: offerBatterySwap ? 'rgba(0, 210, 147, 0.1)' : '#090d16',
                border: offerBatterySwap ? '1px solid #00d293' : '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: offerBatterySwap ? '10px' : '0' }}>
                  <input
                    type="checkbox"
                    checked={offerBatterySwap}
                    onChange={(e) => setOfferBatterySwap(e.target.checked)}
                    style={{ accentColor: '#00d293', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>
                    🔋 I offer Modular Battery Swap Delivery
                  </span>
                </label>

                {offerBatterySwap && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Compatible Scooter Models</span>
                      <input
                        type="text"
                        value={batteryModels}
                        onChange={(e) => setBatteryModels(e.target.value)}
                        className="input-pro"
                        placeholder="Hero Vida, Bounce Infinity"
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Your Swap Fee (₹)</span>
                      <input
                        type="number"
                        value={batteryPrice}
                        onChange={(e) => setBatteryPrice(e.target.value)}
                        className="input-pro"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Paid Activation Ribbon (₹49) */}
            <div style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                  Helper Registration & Audit Fee
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  One-time onboarding pass processed securely via Razorpay
                </div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00d293' }}>
                ₹49
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <span>Pay ₹49 via Razorpay to Activate</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Razorpay Modal for Helper Registration */}
      <RazorpayModal
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        onSuccess={handleRazorpaySuccess}
        amount={49}
        title="Sahayak Helper Onboarding & Audit Pass"
        description="One-time platform listing and equipment verification fee"
      />
    </div>
  );
}
