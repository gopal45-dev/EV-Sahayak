import React, { useState } from 'react';
import { 
  User, Bike, History, CreditCard, LogOut, ShieldCheck, 
  MapPin, Phone, Zap, BatteryCharging, AlertCircle, Plus, 
  Trash2, Edit, CheckCircle2, ChevronRight, Clock, Receipt, Sparkles, 
  AlertTriangle, RefreshCw, Star, Crown, Check 
} from 'lucide-react';
import RazorpayModal from './RazorpayModal';

export default function ProfilePage({ 
  currentUser, 
  vehicles = [], 
  onAddVehicle, 
  onRemoveVehicle, 
  onLogout, 
  theme = 'royal',
  helpers = []
}) {
  const [activeSection, setActiveSection] = useState('garage'); // 'garage', 'rider_history', 'helper_history', 'payments', 'subscription'
  const isRoyal = theme === 'royal';

  // Vehicles state & default vehicle selector (P0: Multiple vehicle profiles)
  const [selectedDefaultId, setSelectedDefaultId] = useState(vehicles[0]?.id || '');
  
  // Modal to add vehicle inside profile
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [brand, setBrand] = useState('Ather');
  const [modelName, setModelName] = useState('450X Gen 3');
  const [variant, setVariant] = useState('Pro Pack');
  const [year, setYear] = useState(2024);
  const [connectorType, setConnectorType] = useState('ATHER_PROPRIETARY');
  const [hasSwappableBattery, setHasSwappableBattery] = useState(false);
  const [batteryPackModel, setBatteryPackModel] = useState('');
  const [regNumber, setRegNumber] = useState('');

  // Complaint & Refund Workflow Modal (P0: Complaint handling, Refund or credit workflow)
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintTarget, setComplaintTarget] = useState(null);
  const [complaintReason, setComplaintReason] = useState('PROVIDER_NO_SHOW');
  const [complaintNotes, setComplaintNotes] = useState('');
  const [refundRequested, setRefundRequested] = useState(true);

  // Pro Subscription (P1: Monthly subscriptions)
  const [isProSubscribed, setIsProSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  // Sample historical records for rider, helper, and payments (matching PRD & backend models)
  const [riderRescueHistory, setRiderRescueHistory] = useState([
    {
      id: 'req_1082',
      date: '02 Nov 2026, 04:15 PM',
      serviceType: 'PORTABLE_CHARGER',
      serviceTitle: 'Mobile 3.3kW Portable Charger Delivery',
      location: '100 Feet Rd, Indiranagar, Bengaluru',
      providerName: 'Ramesh Kumar (QuickEV Assist)',
      status: 'COMPLETED',
      amountPaid: 249,
      unlockFee: 19,
      hasComplaint: false
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
      unlockFee: 19,
      hasComplaint: false
    }
  ]);

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

  const [paymentTransactions, setPaymentTransactions] = useState([
    {
      txId: 'pay_rzp_8941203',
      date: '02 Nov 2026, 04:16 PM',
      purpose: 'Emergency Roadside Contact Unlock Pass (Indiranagar)',
      amount: '₹19.00',
      method: 'Razorpay UPI (Google Pay)',
      status: 'SUCCESS',
      refundStatus: 'NONE'
    },
    {
      txId: 'pay_rzp_7731902',
      date: '30 Oct 2026, 05:22 PM',
      purpose: 'Sahayak Community Helper Equipment Audit & Verification Pass',
      amount: '₹49.00',
      method: 'Razorpay UPI (PhonePe)',
      status: 'SUCCESS',
      refundStatus: 'NONE'
    },
    {
      txId: 'pay_rzp_6521884',
      date: '28 Oct 2026, 11:31 AM',
      purpose: 'Emergency Roadside Contact Unlock Pass (Koramangala)',
      amount: '₹19.00',
      method: 'Razorpay UPI (Paytm)',
      status: 'SUCCESS',
      refundStatus: 'NONE'
    }
  ]);

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setBrand('Ather');
    setModelName('450X Gen 3');
    setVariant('Pro Pack');
    setYear(2024);
    setConnectorType('ATHER_PROPRIETARY');
    setHasSwappableBattery(false);
    setBatteryPackModel('');
    setRegNumber('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (veh) => {
    setEditingVehicle(veh);
    setBrand(veh.brand);
    setModelName(veh.modelName);
    setVariant(veh.variant || '');
    setYear(veh.year || 2024);
    setConnectorType(veh.connectorType || '15A_AC_3PIN');
    setHasSwappableBattery(Boolean(veh.hasSwappableBattery));
    setBatteryPackModel(veh.batteryPackModel || '');
    setRegNumber(veh.registrationNumber || '');
    setShowAddModal(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!brand || !modelName) return;

    if (editingVehicle) {
      if (onRemoveVehicle) onRemoveVehicle(editingVehicle.id);
    }

    if (onAddVehicle) {
      onAddVehicle({
        id: editingVehicle ? editingVehicle.id : `veh_${Date.now()}`,
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
    }

    setShowAddModal(false);
    setEditingVehicle(null);
    setRegNumber('');
  };

  const handleOpenComplaint = (target) => {
    setComplaintTarget(target);
    setComplaintReason('PROVIDER_NO_SHOW');
    setComplaintNotes('');
    setRefundRequested(true);
    setShowComplaintModal(true);
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!complaintTarget) return;

    // Process refund / complaint
    setPaymentTransactions(prev => prev.map(p => {
      if (p.txId === complaintTarget.txId || p.purpose.includes(complaintTarget.location || '')) {
        return { ...p, refundStatus: 'CREDITED_INR_19' };
      }
      return p;
    }));

    setRiderRescueHistory(prev => prev.map(r => {
      if (r.id === complaintTarget.id) {
        return { ...r, hasComplaint: true };
      }
      return r;
    }));

    alert(`Complaint ticket #${Date.now().toString().slice(-6)} recorded. ₹19 platform fee refund credit has been authorized back to your account.`);
    setShowComplaintModal(false);
  };

  const handleProSubscribeSuccess = (paymentDetails) => {
    setShowSubModal(false);
    setIsProSubscribed(true);
    alert(`Congratulations! You are now subscribed to EV Sahayak Pro (${paymentDetails.paymentId}). Unlimited free contact unlocks are active for 30 days.`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* 1. Profile Hero Card with Sign Out Button */}
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
                {isProSubscribed ? (
                  <span className="badge-clean badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={12} /> PRO PASS ACTIVE
                  </span>
                ) : (
                  <span className="badge-clean badge-blue">
                    {currentUser?.role || 'MEMBER'}
                  </span>
                )}
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

          {/* Sign Out Button strictly in Profile Page */}
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
          <span>Rescue History</span>
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
          <span>Helper Earnings History</span>
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
          <span>Payments & Invoices</span>
        </button>

        <button
          onClick={() => setActiveSection('subscription')}
          style={{
            background: activeSection === 'subscription' 
              ? (isRoyal ? '#1d4ed8' : '#2563eb') 
              : 'transparent',
            color: activeSection === 'subscription' 
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
          <Sparkles size={18} color="#fbbf24" />
          <span>Pro Subscription (P1)</span>
        </button>
      </div>

      {/* SECTION 1: MY EV GARAGE (P0: Multiple vehicle profiles - add, edit, select) */}
      {activeSection === 'garage' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                Registered Electric Vehicles
              </h2>
              <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                Manage your electric scooters and choose your active vehicle for 1-click roadside rescues.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={16} />
              <span>Add Vehicle</span>
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div className="pro-card" style={{ padding: '40px 20px', textAlign: 'center', background: isRoyal ? '#ffffff' : '#0f172a' }}>
              <Bike size={44} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: isRoyal ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>Your Garage is Empty</h3>
              <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8', maxWidth: '440px', margin: '0 auto 18px' }}>
                Add your EV to enable compatibility-aware charging filters and instant emergency roadside assistance.
              </p>
              <button onClick={handleOpenAddModal} className="btn-primary" style={{ padding: '8px 18px' }}>
                <Plus size={16} />
                <span>Register Your First EV</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {vehicles.map((veh, index) => {
                const isDefault = selectedDefaultId ? selectedDefaultId === veh.id : index === 0;

                return (
                  <div key={veh.id || index} className="pro-card" style={{
                    background: isRoyal ? '#ffffff' : '#0f172a',
                    padding: '20px',
                    borderColor: isDefault ? (isRoyal ? '#1d4ed8' : '#3b82f6') : (isRoyal ? '#cbd5e1' : '#1e293b'),
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                            {veh.brand} {veh.modelName}
                          </h3>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                          {veh.variant || 'Standard'} • Year {veh.year || 2024}
                        </div>
                      </div>

                      {isDefault ? (
                        <span className="badge-clean badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> Active Vehicle
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedDefaultId(veh.id)}
                          style={{
                            background: 'transparent',
                            border: isRoyal ? '1px solid #cbd5e1' : '1px solid #334155',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: isRoyal ? '#1d4ed8' : '#38bdf8',
                            cursor: 'pointer'
                          }}
                        >
                          Set Active
                        </button>
                      )}
                    </div>

                    <div style={{ background: isRoyal ? '#f8fafc' : '#090d16', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.78rem', color: isRoyal ? '#475569' : '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Charging Connector:</span>
                        <b>{veh.connectorType?.replace(/_/g, ' ') || '15A AC 3-Pin'}</b>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isRoyal ? '#475569' : '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Battery System:</span>
                        <b style={{ color: veh.hasSwappableBattery ? '#00d293' : (isRoyal ? '#1d4ed8' : '#38bdf8') }}>
                          {veh.hasSwappableBattery ? '🔋 Modular Swappable' : '⚡ Fixed Battery'}
                        </b>
                      </div>
                      {veh.registrationNumber && (
                        <div style={{ fontSize: '0.78rem', color: isRoyal ? '#475569' : '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Registration:</span>
                          <b>{veh.registrationNumber}</b>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
                      <button
                        onClick={() => handleOpenEditModal(veh)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      {onRemoveVehicle && (
                        <button
                          onClick={() => onRemoveVehicle(veh.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#dc2626',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: RIDER RESCUE HISTORY (P0: Complaints & Refund Handling) */}
      {activeSection === 'rider_history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
              Past Emergency Rescues
            </h2>
            <span style={{ fontSize: '0.8rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
              Protected under EV Sahayak 100% Service Guarantee
            </span>
          </div>

          {riderRescueHistory.map(req => (
            <div key={req.id} className="pro-card" style={{
              background: isRoyal ? '#ffffff' : '#0f172a',
              padding: '20px',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                    {req.serviceTitle}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                    {req.date} • Reference ID: {req.id}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-clean badge-green">{req.status}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: isRoyal ? '#f8fafc' : '#090d16', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#cbd5e1' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Assigned Helper</span>
                  <b>{req.providerName}</b>
                </div>
                <div style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#cbd5e1' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Location Pin</span>
                  <b>{req.location}</b>
                </div>
                <div style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#cbd5e1' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Total Paid</span>
                  <b>₹{req.amountPaid} (inc. ₹{req.unlockFee} pass)</b>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.75rem', color: '#00d293', fontWeight: 600 }}>
                  ✔ Service Delivered Successfully
                </span>

                <button
                  onClick={() => handleOpenComplaint(req)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <AlertTriangle size={13} />
                  <span>Report Problem / Request Refund</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: HELPER EARNINGS HISTORY */}
      {activeSection === 'helper_history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
            Community Helper Payouts & Rescues
          </h2>

          {helperActivityHistory.map(hlp => (
            <div key={hlp.id} className="pro-card" style={{
              background: isRoyal ? '#ffffff' : '#0f172a',
              padding: '18px',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                    Rescued: {hlp.riderName}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                    {hlp.date} • {hlp.location}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00d293' }}>
                    +₹{hlp.earnedAmount}
                  </div>
                  <span className="badge-clean badge-green" style={{ fontSize: '0.68rem' }}>{hlp.status}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: isRoyal ? '#475569' : '#cbd5e1' }}>
                Service: {hlp.serviceProvided} • Rider Rating: ⭐ <b>{hlp.rating}</b>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 4: PAYMENTS & INVOICES */}
      {activeSection === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
              Razorpay Transactions & Invoices
            </h2>
          </div>

          {paymentTransactions.map(tx => (
            <div key={tx.txId} className="pro-card" style={{
              background: isRoyal ? '#ffffff' : '#0f172a',
              padding: '18px',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
                    {tx.purpose}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isRoyal ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                    Tx ID: {tx.txId} • {tx.date} • via {tx.method}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>
                    {tx.amount}
                  </div>
                  <span className={`badge-clean ${tx.refundStatus === 'CREDITED_INR_19' ? 'badge-amber' : 'badge-green'}`}>
                    {tx.refundStatus === 'CREDITED_INR_19' ? 'REFUND CREDITED' : tx.status}
                  </span>
                </div>
              </div>

              {tx.refundStatus === 'NONE' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: isRoyal ? '1px solid #f1f5f9' : '1px solid #1e293b' }}>
                  <button
                    onClick={() => handleOpenComplaint(tx)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isRoyal ? '#1d4ed8' : '#38bdf8',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Dispute Transaction / Request Refund
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECTION 5: EV SAHAYAK PRO MONTHLY SUBSCRIPTION (P1: Monthly subscriptions) */}
      {activeSection === 'subscription' && (
        <div className="pro-card" style={{
          background: isRoyal ? '#ffffff' : '#0f172a',
          padding: '32px',
          border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Sparkles size={24} color="#fbbf24" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
              EV Sahayak Pro Monthly Membership
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: isRoyal ? '#475569' : '#94a3b8', marginBottom: '24px', maxWidth: '640px' }}>
            Designed for regular EV commuters and delivery fleet riders across Bengaluru. Never worry about roadside breakdown access charges.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div style={{ background: isRoyal ? '#f8fafc' : '#090d16', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: isRoyal ? '#0f172a' : '#ffffff', marginBottom: '12px' }}>
                Pro Plan Benefits
              </div>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: isRoyal ? '#475569' : '#cbd5e1' }}>
                <li><b>Unlimited Free Contact Unlocks:</b> ₹19 platform fee waived for 30 days.</li>
                <li><b>Priority Helper Dispatch:</b> Requests sent to nearest top-tier helpers first.</li>
                <li><b>Direct Tele-Assistance:</b> 24/7 dedicated helpline pin.</li>
                <li><b>Exclusive Route Alerts:</b> Notifications when new fast grids go live on your commute.</li>
              </ul>
            </div>

            <div style={{ background: isRoyal ? '#eff6ff' : '#0f1a33', border: isRoyal ? '1px solid #bfdbfe' : '1px solid #1d4ed8', borderRadius: '12px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: isRoyal ? '#1d4ed8' : '#60a5fa', fontWeight: 700 }}>
                MONTHLY PASS
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff', margin: '8px 0' }}>
                ₹199 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>/ month</span>
              </div>
              {isProSubscribed ? (
                <div style={{ color: '#00d293', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} />
                  <span>Your Subscription is Active</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowSubModal(true)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
                >
                  Subscribe for ₹199 / mo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Electric Vehicle */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="pro-card" style={{ maxWidth: '480px', width: '100%', padding: '24px', background: isRoyal ? '#ffffff' : '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: isRoyal ? '#0f172a' : '#ffffff' }}>
              {editingVehicle ? 'Edit Vehicle Profile' : 'Add Vehicle to EV Garage'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8', marginBottom: '16px' }}>
              Configure vehicle connector and battery specs for compatibility filters.
            </p>

            <form onSubmit={handleSaveVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="KA-01-EV-1234"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
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

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingVehicle ? 'Update Vehicle' : 'Save to Garage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Complaint Handling & Instant Refund Credit (P0: Complaint handling, Refund workflow) */}
      {showComplaintModal && complaintTarget && (
        <div className="modal-overlay">
          <div className="pro-card" style={{ maxWidth: '460px', width: '100%', padding: '24px', background: isRoyal ? '#ffffff' : '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginBottom: '6px' }}>
              Report Issue & Request Refund
            </h3>
            <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8', marginBottom: '16px' }}>
              Reporting item: <b>{complaintTarget.serviceTitle || complaintTarget.purpose || complaintTarget.txId}</b>
            </p>

            <form onSubmit={handleSubmitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Problem Reason *
                </label>
                <select
                  value={complaintReason}
                  onChange={(e) => setComplaintReason(e.target.value)}
                  className="input-pro"
                >
                  <option value="PROVIDER_NO_SHOW">Helper did not arrive within committed time</option>
                  <option value="UNRESPONSIVE_PHONE">Helper telephone was unreachable or switch off</option>
                  <option value="INCORRECT_EQUIPMENT">Charger connector was incompatible with my vehicle</option>
                  <option value="PRICE_DISCREPANCY">Helper requested more money than confirmed rate</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: isRoyal ? '#475569' : '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Additional Notes
                </label>
                <textarea
                  value={complaintNotes}
                  onChange={(e) => setComplaintNotes(e.target.value)}
                  rows={3}
                  className="input-pro"
                  placeholder="Explain what happened for admin review..."
                />
              </div>

              <div style={{ background: isRoyal ? '#fff1f2' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626' }}>
                  Automatic Refund Eligibility
                </div>
                <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#cbd5e1' }}>
                  Per PRD Module C, eligible helper failures qualify for an instant ₹19 credit to your account.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: '#dc2626' }}>
                  Submit Complaint & Claim Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Razorpay Modal for Pro Subscription */}
      <RazorpayModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSuccess={handleProSubscribeSuccess}
        amount={199}
        title="EV Sahayak Pro Monthly Pass"
        description="Unlimited free emergency contact unlocks + priority roadside dispatch"
      />
    </div>
  );
}
