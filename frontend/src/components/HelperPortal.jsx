import React, { useState } from 'react';
import { 
  HeartHandshake, BatteryCharging, Zap, MapPin, ShieldCheck, 
  Power, Plus, CheckCircle2, Lock, ArrowRight, UserCheck 
} from 'lucide-react';
import RazorpayModal from './RazorpayModal';

export default function HelperPortal({ helpers = [], onRegisterHelper, onToggleStatus, currentUser }) {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'register'
  
  // Registration Form
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
  const [area, setArea] = useState('Indiranagar, Bengaluru');
  const [radiusKm, setRadiusKm] = useState(8);
  
  // Assistance Capabilities
  const [offerPortableCharger, setOfferPortableCharger] = useState(true);
  const [chargerKw, setChargerKw] = useState(3.3);
  const [chargerPrice, setChargerPrice] = useState(250);

  const [offerBatterySwap, setOfferBatterySwap] = useState(false);
  const [batteryModels, setBatteryModels] = useState('Hero Vida V1, Bounce Infinity E1');
  const [batteryPrice, setBatteryPrice] = useState(199);

  // Razorpay for Helper Registration Fee
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [pendingHelperData, setPendingHelperData] = useState(null);

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
      ownerId: currentUser?.phone || currentUser?.name || phone, // Store owner identifier
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
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Top Banner */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-clean badge-green">SAHAYAK PROVIDER NETWORK</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bengaluru Helper Directory</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.1rem', color: '#ffffff', marginBottom: '6px' }}>
              Earn by Helping Stranded EV Riders
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '640px' }}>
              List your portable charger or swappable batteries to receive paid roadside rescue requests. Manage your availability anytime.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              className={activeTab === 'browse' ? 'btn-primary' : 'btn-secondary'}
            >
              All Registered Helpers
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}
            >
              <Plus size={16} />
              <span>List My Equipment</span>
            </button>
          </div>
        </div>
      </div>

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {helpers.map(helper => {
            const isOnline = helper.availabilityStatus === 'AVAILABLE';

            // User Rule: Only the creator/owner of this helper resource can toggle it online/offline!
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
                    <span>{helper.verificationLevel.replace('_', ' ')}</span>
                  </div>
                  <div>
                    ⭐ <b>{helper.rating}</b> ({helper.completedRescues} rescues)
                  </div>
                </div>

                {/* Status Toggle Action: ONLY AVAILABLE TO THE OWNER PER USER SPECIFICATION! */}
                {isOwner ? (
                  <button
                    onClick={() => onToggleStatus(helper.id)}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '14px', fontSize: '0.82rem', padding: '8px' }}
                  >
                    <Power size={14} />
                    <span>Change My Status: {isOnline ? 'Go Offline' : 'Go Online'}</span>
                  </button>
                ) : (
                  <div style={{
                    marginTop: '14px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    fontSize: '0.72rem',
                    color: '#64748b',
                    textAlign: 'center'
                  }}>
                    🔒 Managed by {helper.displayName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* REGISTER FORM WITH PAID ACTIVATION VIA RAZORPAY */}
      {activeTab === 'register' && (
        <div className="pro-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '28px' }}>
          <h2 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '4px' }}>
            List Your Assistance Equipment
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '20px' }}>
            Register your portable charger or battery inventory. A nominal ₹49 verification pass fee ensures authenticity and gives you full control to toggle your availability.
          </p>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Helper / Provider Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-pro"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                    Mobile Number *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: phone.length === 10 ? '#00d293' : '#64748b' }}>
                    {phone.length}/10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(digitsOnly);
                  }}
                  className="input-pro"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Operating Radius (km)
                </label>
                <input
                  type="number"
                  min="2"
                  max="25"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="input-pro"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                Base Bengaluru Operating Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="input-pro"
              />
            </div>

            {/* Assistance Services Offerings */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>
                Select Assistance Services Offered
              </div>

              {/* Service 1: Portable Charger */}
              <div style={{
                background: offerPortableCharger ? '#0f1a33' : '#090d16',
                border: offerPortableCharger ? '1px solid #3b82f6' : '1px solid #1e293b',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: offerPortableCharger ? '10px' : '0' }}>
                  <input
                    type="checkbox"
                    checked={offerPortableCharger}
                    onChange={(e) => setOfferPortableCharger(e.target.checked)}
                    style={{ accentColor: '#2563eb', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>
                    🔌 I offer Portable Charger & Cable Rescue
                  </span>
                </label>

                {offerPortableCharger && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Charger Rating (kW)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={chargerKw}
                        onChange={(e) => setChargerKw(e.target.value)}
                        className="input-pro"
                      />
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
                background: offerBatterySwap ? '#062e24' : '#090d16',
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

            {/* Paid Activation Ribbon */}
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
