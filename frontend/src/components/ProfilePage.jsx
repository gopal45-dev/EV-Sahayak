import React, { useState } from 'react';
import { 
  User, Bike, History, CreditCard, LogOut, ShieldCheck, 
  MapPin, Phone, Zap, BatteryCharging, AlertCircle, Plus, 
  Trash2, CheckCircle2, ChevronRight, Clock, Receipt, Sparkles 
} from 'lucide-react';

export default function ProfilePage({ 
  currentUser, 
  vehicles = [], 
  onAddVehicle, 
  onRemoveVehicle, 
  onLogout, 
  theme = 'royal',
  helpers = []
}) {
  const [activeSection, setActiveSection] = useState('garage'); // 'garage', 'rider_history', 'helper_history', 'payments'
  const isRoyal = theme === 'royal';

  // Modal to add vehicle inside profile
  const [showAddModal, setShowAddModal] = useState(false);
  const [brand, setBrand] = useState('Ather');
  const [modelName, setModelName] = useState('450X Gen 3');
  const [variant, setVariant] = useState('Pro Pack');
  const [year, setYear] = useState(2024);
  const [connectorType, setConnectorType] = useState('ATHER_PROPRIETARY');
  const [hasSwappableBattery, setHasSwappableBattery] = useState(false);
  const [batteryPackModel, setBatteryPackModel] = useState('');
  const [regNumber, setRegNumber] = useState('');

  // Sample historical records for rider, helper, and payments (matching PRD & backend models)
  const riderRescueHistory = [
    {
      id: 'req_1082',
      date: '02 Nov 2026, 04:15 PM',
      serviceType: 'PORTABLE_CHARGER',
      serviceTitle: 'Mobile 3.3kW Portable Charger Delivery',
      location: '100 Feet Rd, Indiranagar, Bengaluru',
      providerName: 'Ramesh Kumar (QuickEV Assist)',
      status: 'COMPLETED',
      amountPaid: 249,
      unlockFee: 19
    },
    {
      id: 'req_0941',
      date: '28 Oct 2026, 11:30 AM',
      serviceType: 'BATTERY_SWAP',
      serviceTitle: 'Charged Modular Battery Pack Delivery',
      location: 'Koramangala 4th Block, Bengaluru',
      providerName: 'Sun Mobility / Quick Swap',
      status: 'COMPLETED',
      amountPaid: 199,
      unlockFee: 19
    }
  ];

  const helperActivityHistory = [
    {
      id: 'hlp_res_301',
      date: '03 Nov 2026, 07:45 PM',
      riderName: 'Vikram S. (Ola S1 Pro)',
      location: 'HSR Layout Sector 2, Bengaluru',
      serviceProvided: 'Mobile 3.3kW Charger & 15A Extension',
      earnedAmount: 249,
      rating: 5.0,
      status: 'PAYOUT_SETTLED'
    },
    {
      id: 'hlp_res_288',
      date: '31 Oct 2026, 02:10 PM',
      riderName: 'Ananya Rao (Ather 450X)',
      location: 'Domlur Flyover, Bengaluru',
      serviceProvided: 'Emergency Boost Charging',
      earnedAmount: 249,
      rating: 4.9,
      status: 'PAYOUT_SETTLED'
    }
  ];

  const paymentTransactions = [
    {
      txId: 'pay_rzp_8941203',
      date: '02 Nov 2026, 04:16 PM',
      purpose: 'Emergency Roadside Contact Unlock Pass (Indiranagar)',
      amount: '₹19.00',
      method: 'Razorpay UPI (Google Pay)',
      status: 'SUCCESS'
    },
    {
      txId: 'pay_rzp_7731902',
      date: '30 Oct 2026, 05:22 PM',
      purpose: 'Sahayak Community Helper Equipment Audit & Verification Pass',
      amount: '₹49.00',
      method: 'Razorpay UPI (PhonePe)',
      status: 'SUCCESS'
    },
    {
      txId: 'pay_rzp_6521884',
      date: '28 Oct 2026, 11:31 AM',
      purpose: 'Emergency Roadside Contact Unlock Pass (Koramangala)',
      amount: '₹19.00',
      method: 'Razorpay UPI (Paytm)',
      status: 'SUCCESS'
    }
  ];

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    if (!brand || !modelName) return;

    onAddVehicle({
      brand,
      modelName,
      variant,
      year: Number(year),
      batteryCapacityKwh: 3.8,
      connectorType,
      hasSwappableBattery,
      batteryPackModel: batteryPackModel || (hasSwappableBattery ? `${brand} Modular Battery` : 'Fixed Battery'),
      registrationNumber: regNumber
    });

    setShowAddModal(false);
    setRegNumber('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* 1. Profile Hero Card */}
      <div className="pro-card" style={{
        background: isRoyal ? '#ffffff' : '#0f172a',
        padding: '28px 32px',
        marginBottom: '28px',
        border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isRoyal ? '#1d4ed8' : '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 800,
              boxShadow: isRoyal ? '0 6px 16px rgba(29, 78, 216, 0.25)' : '0 6px 16px rgba(37, 99, 235, 0.3)'
            }}>
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                  {currentUser?.name || 'EV Rider'}
                </h1>
                <span className="badge-clean badge-blue">
                  {currentUser?.role || 'MEMBER'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '6px', fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> +91 {currentUser?.phone || '98451 00000'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color={isRoyal ? '#059669' : '#00d293'} /> {currentUser?.location?.address || 'Bengaluru, Karnataka'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color={isRoyal ? '#1d4ed8' : '#38bdf8'} /> KYC & Phone Verified
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out Button in Profile Header */}
          <button
            onClick={onLogout}
            style={{
              background: isRoyal ? '#fff1f2' : 'rgba(239, 68, 68, 0.1)',
              border: isRoyal ? '1px solid #fecdd3' : '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. Profile Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: isRoyal ? '2px solid #e2e8f0' : '2px solid #1e293b',
        paddingBottom: '12px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveSection('garage')}
          style={{
            background: activeSection === 'garage' 
              ? (isRoyal ? '#1d4ed8' : '#2563eb') 
              : 'transparent',
            color: activeSection === 'garage' 
              ? '#ffffff' 
              : (isRoyal ? '#475569' : '#94a3b8'),
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Bike size={18} />
          <span>My EV Garage ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('rider_history')}
          style={{
            background: activeSection === 'rider_history' 
              ? (isRoyal ? '#1d4ed8' : '#2563eb') 
              : 'transparent',
            color: activeSection === 'rider_history' 
              ? '#ffffff' 
              : (isRoyal ? '#475569' : '#94a3b8'),
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <AlertCircle size={18} />
          <span>Rescue Requests History</span>
        </button>

        <button
          onClick={() => setActiveSection('helper_history')}
          style={{
            background: activeSection === 'helper_history' 
              ? (isRoyal ? '#1d4ed8' : '#2563eb') 
              : 'transparent',
            color: activeSection === 'helper_history' 
              ? '#ffffff' 
              : (isRoyal ? '#475569' : '#94a3b8'),
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <History size={18} />
          <span>Helper Earnings & Activity</span>
        </button>

        <button
          onClick={() => setActiveSection('payments')}
          style={{
            background: activeSection === 'payments' 
              ? (isRoyal ? '#1d4ed8' : '#2563eb') 
              : 'transparent',
            color: activeSection === 'payments' 
              ? '#ffffff' 
              : (isRoyal ? '#475569' : '#94a3b8'),
            border: 'none',
            borderRadius: '10px',
            padding: '9px 16px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <CreditCard size={18} />
          <span>Payment History</span>
        </button>
      </div>

      {/* 3. Section Content */}
      
      {/* SECTION A: MY EV GARAGE (Shifted here per instructions) */}
      {activeSection === 'garage' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                My Electric Vehicle Garage
              </h2>
              <p style={{ fontSize: '0.84rem', color: isRoyal ? '#475569' : '#94a3b8' }}>
                Manage your electric scooters to enable automatic connector and battery compatibility matching.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '9px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Add New EV</span>
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="pro-card" style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: isRoyal ? '1px dashed #cbd5e1' : '1px dashed #334155'
            }}>
              <div style={{
                background: isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(37, 99, 235, 0.15)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: isRoyal ? '#1d4ed8' : '#3b82f6'
              }}>
                <Bike size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: isRoyal ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>
                Your Garage is Empty
              </h3>
              <p style={{ fontSize: '0.85rem', color: isRoyal ? '#64748b' : '#94a3b8', maxWidth: '440px', margin: '0 auto 20px' }}>
                Add your electric scooter (Ather, Ola, TVS, Vida, Bounce) so emergency helpers bring the right charger connector or battery pack.
              </p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus size={16} />
                <span>Add Your First EV</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {vehicles.map(v => (
                <div key={v.id} className="pro-card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(59, 130, 246, 0.15)',
                        color: isRoyal ? '#1d4ed8' : '#60a5fa',
                        padding: '10px',
                        borderRadius: '10px'
                      }}>
                        <Bike size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                          {v.brand} {v.modelName}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                          {v.variant} • Year {v.year}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveVehicle(v.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                      title="Remove vehicle"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{
                    background: isRoyal ? '#f8fafc' : '#090d16',
                    border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isRoyal ? '#64748b' : '#94a3b8' }}>Charging Connector:</span>
                      <strong style={{ color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>{v.connectorType}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: isRoyal ? '#64748b' : '#94a3b8' }}>Battery System:</span>
                      <strong style={{ color: v.hasSwappableBattery ? (isRoyal ? '#059669' : '#00d293') : (isRoyal ? '#64748b' : '#94a3b8') }}>
                        {v.hasSwappableBattery ? '🔋 Swappable Modular Pack' : '⚡ Fixed Battery'}
                      </strong>
                    </div>
                    {v.batteryPackModel && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: isRoyal ? '#64748b' : '#94a3b8' }}>Pack Spec:</span>
                        <span style={{ color: isRoyal ? '#0f172a' : '#ffffff' }}>{v.batteryPackModel}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: isRoyal ? '#059669' : '#00d293' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Ready for Instant Rescue Matching
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION B: RESCUE REQUESTS HISTORY */}
      {activeSection === 'rider_history' && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>
            Emergency Rescue Requests History
          </h2>
          <p style={{ fontSize: '0.84rem', color: isRoyal ? '#475569' : '#94a3b8', marginBottom: '20px' }}>
            Logs of your roadside emergency dispatches, matched helpers, and completed rescues.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {riderRescueHistory.map(item => (
              <div key={item.id} className="pro-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge-clean badge-blue">{item.serviceType}</span>
                      <strong style={{ fontSize: '0.95rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
                        {item.serviceTitle}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                      <span>📅 {item.date}</span>
                      <span>📍 {item.location}</span>
                      <span>🤝 Provider: {item.providerName}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isRoyal ? '#059669' : '#00d293' }}>
                      ₹{item.amountPaid}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                      Status: <strong style={{ color: isRoyal ? '#059669' : '#00d293' }}>{item.status}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: HELPER ACTIVITY HISTORY */}
      {activeSection === 'helper_history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                Helper Activity & Rescue Payouts
              </h2>
              <p style={{ fontSize: '0.84rem', color: isRoyal ? '#475569' : '#94a3b8' }}>
                Summary of roadside assistance you provided to stranded EV riders and earned platform payouts.
              </p>
            </div>
            <div style={{
              background: isRoyal ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 210, 147, 0.1)',
              border: isRoyal ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(0, 210, 147, 0.25)',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              color: isRoyal ? '#059669' : '#00d293',
              fontWeight: 700
            }}>
              Total Earned: ₹498.00
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {helperActivityHistory.map(item => (
              <div key={item.id} className="pro-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge-clean badge-green">COMPLETED RESCUE</span>
                      <strong style={{ fontSize: '0.95rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
                        {item.serviceProvided}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                      <span>📅 {item.date}</span>
                      <span>🛵 Rider: {item.riderName}</span>
                      <span>📍 {item.location}</span>
                      <span>⭐ Rating: {item.rating} / 5.0</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isRoyal ? '#059669' : '#00d293' }}>
                      +₹{item.earnedAmount}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: isRoyal ? '#059669' : '#00d293', fontWeight: 600 }}>
                      Payout Settled
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: PAYMENT TRANSACTIONS */}
      {activeSection === 'payments' && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>
            Razorpay Payment & Gateway Invoices
          </h2>
          <p style={{ fontSize: '0.84rem', color: isRoyal ? '#475569' : '#94a3b8', marginBottom: '20px' }}>
            Official transaction references for platform unlocks (₹19) and helper audits (₹49).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paymentTransactions.map(tx => (
              <div key={tx.txId} className="pro-card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(37, 99, 235, 0.15)',
                      color: isRoyal ? '#1d4ed8' : '#60a5fa',
                      padding: '10px',
                      borderRadius: '10px'
                    }}>
                      <Receipt size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
                        {tx.purpose}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isRoyal ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                        TxID: <code style={{ color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>{tx.txId}</code> • {tx.method} • {tx.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                      {tx.amount}
                    </div>
                    <span className="badge-clean badge-green" style={{ fontSize: '0.68rem', marginTop: '3px' }}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add EV Modal inside Profile */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="pro-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: isRoyal ? '#0f172a' : '#ffffff' }}>
              Add Electric Vehicle to Garage
            </h3>
            <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8', marginBottom: '16px' }}>
              Save vehicle specs for instant emergency roadside compatibility.
            </p>

            <form onSubmit={handleCreateVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Brand & Make *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="input-pro"
                >
                  <option value="Ather">Ather Energy</option>
                  <option value="Ola">Ola Electric</option>
                  <option value="TVS">TVS Motor</option>
                  <option value="Hero Vida">Hero Vida</option>
                  <option value="Bounce">Bounce Infinity</option>
                  <option value="Bajaj">Bajaj Auto</option>
                  <option value="Ultraviolette">Ultraviolette</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 450X, S1 Pro, iQube, V1 Pro, E1+"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="input-pro"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Primary Charging Connector *
                </label>
                <select
                  value={connectorType}
                  onChange={(e) => setConnectorType(e.target.value)}
                  className="input-pro"
                >
                  <option value="15A_AC_3PIN">15A AC Standard 3-Pin Socket</option>
                  <option value="ATHER_PROPRIETARY">Ather Proprietary Fast Dot</option>
                  <option value="OLA_HYPER">Ola Hypercharger Socket</option>
                  <option value="SWAPPABLE_DOCK">Battery Swap Dock Connector</option>
                  <option value="TYPE_2">Type 2 AC</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: isRoyal ? '#0f172a' : '#ffffff', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={hasSwappableBattery}
                    onChange={(e) => setHasSwappableBattery(e.target.checked)}
                    style={{ accentColor: '#1d4ed8', width: '16px', height: '16px' }}
                  />
                  <span>Has Modular / Swappable Removable Battery</span>
                </label>
              </div>

              {hasSwappableBattery && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                    Battery Pack Specification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bounce Dock, Hero Vida Removable Pack"
                    value={batteryPackModel}
                    onChange={(e) => setBatteryPackModel(e.target.value)}
                    className="input-pro"
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
