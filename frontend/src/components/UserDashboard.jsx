import React, { useState, Suspense, lazy } from 'react';
import { 
  Zap, AlertCircle, MapPin, HeartHandshake, Bike, 
  ShieldCheck, Navigation, ArrowRight, BatteryCharging, 
  Clock, Sparkles, CheckCircle2, ChevronRight, HelpCircle, X, ExternalLink, RotateCw
} from 'lucide-react';

const ThreeVisualizer = lazy(() => import('./ThreeVisualizer'));

export default function UserDashboard({ 
  currentUser, 
  vehicles = [], 
  stations = [], 
  helpers = [], 
  onNavigate,
  theme = 'obsidian',
  isTourOpen = false,
  setIsTourOpen
}) {
  const [internalTourOpen, setInternalTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const showTour = isTourOpen || internalTourOpen;
  const setShowTour = (val) => {
    setInternalTourOpen(val);
    if (setIsTourOpen) setIsTourOpen(val);
  };

  const isRoyal = theme === 'royal';
  const activeHelpersCount = helpers.filter(h => h.availabilityStatus === 'AVAILABLE').length;

  // Predictive Battery Assistance (Future PRD Requirement)
  const [predBattery, setPredBattery] = useState(22);
  const [ridingMode, setRidingMode] = useState('NORMAL');
  const activeVehicle = vehicles[0] || { brand: 'Ather', modelName: '450X' };

  // Range calculation based on battery % and mode
  const modeMultiplier = ridingMode === 'ECO' ? 1.05 : (ridingMode === 'SPORT' ? 0.72 : 0.88);
  const estimatedKm = (predBattery * 0.95 * modeMultiplier).toFixed(1);
  const safeRadiusKm = (estimatedKm * 0.75).toFixed(1);
  const isCritical = predBattery <= 15;

  const tourSteps = [
    {
      title: 'Welcome to EV Sahayak (ईवी सहायक)',
      subtitle: 'Bengaluru’s On-Demand Electric Vehicle Charging & Roadside Rescue Ecosystem',
      description: 'EV Sahayak is designed to eliminate range anxiety for electric two-wheeler riders. Whether you are stranded with a dead battery or planning your city ride, EV Sahayak connects you with verified charging points and local peer helpers equipped with portable chargers and modular batteries.',
      icon: Zap,
      accentColor: '#2563eb',
      badge: 'Getting Started',
      actionText: 'Next: Step 1',
      navTarget: null
    },
    {
      title: '1. Register Your EV in "My EV Garage"',
      subtitle: 'Connector & Swappable Battery Compatibility',
      description: 'Before requesting rescue, add your electric scooter to your garage (located in your Profile). This ensures EV Sahayak automatically checks whether your EV needs a 15A AC plug, Ather Dot, Type 2, or supports instant 3-minute modular battery swaps (like Hero Vida & Bounce Infinity).',
      icon: Bike,
      accentColor: '#3b82f6',
      badge: 'Essential Setup',
      actionText: 'Go to Profile & EV Garage',
      navTarget: 'profile'
    },
    {
      title: '2. Request Emergency Assistance',
      subtitle: 'Real-Time GPS Location Matching & Rescue',
      description: 'Stranded on the road? The Emergency Assistance tab uses your live device GPS to locate nearby helpers with portable chargers or swappable batteries. Helpers are confirmed with locked pricing and an ETA within 15 minutes.',
      icon: AlertCircle,
      accentColor: '#f43f5e',
      badge: 'SOS Rescue',
      actionText: 'View Emergency Rescue',
      navTarget: 'emergency'
    },
    {
      title: '3. Find Verified Charging Stations',
      subtitle: '100% Free Public Charging Directory',
      description: 'Search hundreds of public charging docks across Bengaluru including Tata Power, BESCOM, Ather Grid, and Jio-bp with live filter by connector type and turn-by-turn navigation.',
      icon: MapPin,
      accentColor: '#00d293',
      badge: 'Free Directory',
      actionText: 'Explore Stations',
      navTarget: 'charging'
    },
    {
      title: '4. Earn by Helping Other EV Riders',
      subtitle: 'Monetize Your Portable Charger or Battery Pack',
      description: 'Join the community helper network for a one-time ₹49 audit fee. Toggle your status online when available, receive rescue dispatches near your area, and earn verified platform fees assisting fellow riders.',
      icon: HeartHandshake,
      accentColor: '#8b5cf6',
      badge: 'Community Network',
      actionText: 'Open Helper Portal',
      navTarget: 'helper'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* 1. Welcome & 3D Interactive Hero Banner */}
      <div style={{
        background: isRoyal 
          ? 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)' 
          : 'linear-gradient(135deg, #0f172a 0%, #172554 100%)',
        border: isRoyal ? '1px solid #bfdbfe' : '1px solid #1e293b',
        borderRadius: '18px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: isRoyal ? '0 8px 30px rgba(37,99,235,0.08)' : '0 8px 30px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '260px',
          height: '260px',
          background: isRoyal 
            ? 'radial-gradient(circle, rgba(29,78,216,0.12) 0%, rgba(29,78,216,0) 70%)' 
            : 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          alignItems: 'center', 
          gap: '24px', 
          position: 'relative', 
          zIndex: 1 
        }}>
          {/* Left Column: Welcome & Quick Launch */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(37, 99, 235, 0.2)', 
              border: isRoyal ? '1px solid rgba(29, 78, 216, 0.25)' : '1px solid rgba(59, 130, 246, 0.3)', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.78rem', 
              color: isRoyal ? '#1d4ed8' : '#60a5fa', 
              fontWeight: 600, 
              marginBottom: '12px' 
            }}>
              <Sparkles size={14} />
              <span>Bengaluru EV Roadside Assistance & Discovery Pilot</span>
            </div>

            <h1 style={{ 
              fontSize: '1.95rem', 
              fontWeight: 800, 
              color: isRoyal ? '#0f172a' : '#ffffff', 
              marginBottom: '8px', 
              letterSpacing: '-0.02em' 
            }}>
              Welcome back, {currentUser?.name || 'EV Rider'} 👋
            </h1>

            <p style={{ 
              fontSize: '0.92rem', 
              color: isRoyal ? '#475569' : '#cbd5e1', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            }}>
              Your central command for Bengaluru electric mobility. Find verified charging stations, register your EV, or request immediate roadside assistance when stranded.
            </p>

            {/* Quick Status Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {/* GPS Live Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: isRoyal ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 210, 147, 0.1)',
                border: isRoyal ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(0, 210, 147, 0.25)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: isRoyal ? '#059669' : '#00d293',
                fontWeight: 600
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isRoyal ? '#059669' : '#00d293', boxShadow: '0 0 8px #00d293' }} />
                <span>GPS Pin: {currentUser?.location?.lat?.toFixed(3)}°N, {currentUser?.location?.lng?.toFixed(3)}°E</span>
              </div>

              {/* Garage Status (opens profile) */}
              <div 
                onClick={() => onNavigate('profile')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: vehicles.length > 0 
                    ? (isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(59, 130, 246, 0.12)') 
                    : (isRoyal ? 'rgba(217, 119, 6, 0.1)' : 'rgba(245, 158, 11, 0.12)'),
                  border: vehicles.length > 0 
                    ? (isRoyal ? '1px solid rgba(29, 78, 216, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)') 
                    : (isRoyal ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'),
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: vehicles.length > 0 
                    ? (isRoyal ? '#1d4ed8' : '#60a5fa') 
                    : (isRoyal ? '#d97706' : '#fbbf24'),
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Bike size={14} />
                <span>{vehicles.length > 0 ? `${vehicles.length} EV in Garage (${vehicles[0].brand})` : 'Garage: + Add in Profile'}</span>
              </div>

              {/* Active Helpers */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: isRoyal ? 'rgba(220, 38, 38, 0.08)' : 'rgba(139, 92, 246, 0.1)',
                border: isRoyal ? '1px solid rgba(220, 38, 38, 0.25)' : '1px solid rgba(139, 92, 246, 0.25)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: isRoyal ? '#dc2626' : '#c084fc',
                fontWeight: 600
              }}>
                <ShieldCheck size={14} />
                <span>{activeHelpersCount} Sahayak Helpers Ready</span>
              </div>
            </div>

            {/* Quick Tour Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  setTourStep(0);
                  setShowTour(true);
                }}
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <HelpCircle size={16} />
                <span>Interactive App Tour</span>
              </button>
              <span style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                4 Core Features • 60-second guide
              </span>
            </div>
          </div>

          {/* Right Column: High-Performance 3D EV Core Visualization */}
          <div style={{
            background: isRoyal ? 'rgba(241, 245, 249, 0.7)' : 'rgba(11, 17, 32, 0.6)',
            border: isRoyal ? '1px solid #cbd5e1' : '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            minHeight: '230px',
            backdropFilter: 'blur(8px)'
          }}>
            <Suspense fallback={
              <div style={{ minHeight: '210px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '8px' }}>
                <RotateCw size={24} className="animate-spin" color="#3b82f6" />
                <span style={{ fontSize: '0.78rem' }}>Loading 3D Core...</span>
              </div>
            }>
              <ThreeVisualizer theme={theme} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 2. Urgent Roadside SOS Card */}
      <div style={{
        background: isRoyal 
          ? 'linear-gradient(90deg, #fff1f2 0%, #ffffff 100%)' 
          : 'linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%)',
        border: isRoyal ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: isRoyal ? '0 4px 16px rgba(225, 29, 72, 0.08)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
              Stranded on the Road with Low Battery?
            </div>
            <div style={{ fontSize: '0.82rem', color: isRoyal ? '#475569' : '#cbd5e1', marginTop: '2px' }}>
              Request portable charger delivery or a compatible modular battery swap right to your live device GPS pin.
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('emergency')}
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 22px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
            transition: 'all 0.15s ease'
          }}
        >
          <Zap size={18} />
          <span>Dispatch Emergency Rescue</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 3. Section Title */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
          App Walkthrough & Core Services
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
          Get familiar with EV Sahayak's 4 primary modules and navigate directly to what you need.
        </p>
      </div>

      {/* 4. Four Core Feature Walkthrough Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Module 1: Garage */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex'
              }}>
                <Bike size={24} />
              </div>
              <span className="badge-clean badge-blue">STEP 1 • PROFILE</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              My EV Garage
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              Save your electric two-wheeler (Ather, Ola, TVS, Vida, Bounce, etc.). Compatibility matching ensures helpers bring the exact charger connector or swappable pack your bike supports.
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              <strong>Status:</strong> {vehicles.length === 0 ? '⚠️ No EV added yet' : `✅ ${vehicles.length} Registered (${vehicles[0].brand})`}
            </div>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <span>{vehicles.length === 0 ? 'Add Your Vehicle' : 'Manage in Profile'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Module 2: Emergency Rescue */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#f43f5e',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex'
              }}>
                <AlertCircle size={24} />
              </div>
              <span className="badge-clean" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
                STEP 2 • ON-DEMAND SOS
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Emergency Rescue
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              Stranded with low battery? Set battery slider from 0 to 100%, match with verified helpers in Bengaluru, and unlock contact details with an automated WhatsApp location pin.
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              <strong>Rescue SLA:</strong> 15-Minute Expiry • ₹19 Contact Pass
            </div>
          </div>

          <button
            onClick={() => onNavigate('emergency')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <span>Open Rescue Screen</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Module 3: Charging Station Directory */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(0, 210, 147, 0.15)',
                color: '#00d293',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex'
              }}>
                <MapPin size={24} />
              </div>
              <span className="badge-clean badge-green">STEP 3 • DIRECTORY</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Find Charging Stations
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              Explore verified charging points and battery swap docks across Bengaluru. Filter by Tata Power, BESCOM, Ather, or Jio-bp with 100% free turn-by-turn Google Maps navigation.
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              <strong>Coverage:</strong> {stations.length} Verified Charging Hubs
            </div>
          </div>

          <button
            onClick={() => onNavigate('charging')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <span>Search Stations</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Module 4: Earn by Helping */}
        <div className="pro-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#a855f7',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex'
              }}>
                <HeartHandshake size={24} />
              </div>
              <span className="badge-clean" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                STEP 4 • COMMUNITY
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Earn by Helping
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              Have an EV charger or portable battery? Register as an audited Sahayak helper for ₹49. Toggle availability status anytime and get paid assisting stranded EV riders.
            </p>

            <div style={{
              background: '#090d16',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '20px'
            }}>
              <strong>Payout:</strong> Confirmed price paid directly by rider
            </div>
          </div>

          <button
            onClick={() => onNavigate('helper')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <span>Register as Helper</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 5. Predictive Battery & Safe Radius Assistance (Future PRD Requirement) */}
      <div className="pro-card" style={{
        padding: '24px 28px',
        marginBottom: '28px',
        background: isCritical 
          ? (isRoyal ? '#fff1f2' : 'rgba(239, 68, 68, 0.08)') 
          : (isRoyal ? '#ffffff' : '#0f172a'),
        borderColor: isCritical ? '#dc2626' : (isRoyal ? '#cbd5e1' : '#1e293b')
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <BatteryCharging size={20} color={isCritical ? '#dc2626' : '#00d293'} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                Predictive Battery & Safe Reach Radius
              </h3>
              <span className={`badge-clean ${isCritical ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                {isCritical ? 'CRITICAL RESERVE' : 'TELEMETRY ACTIVE'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
              Real-time range prediction for your <b>{activeVehicle.brand} {activeVehicle.modelName}</b> based on remaining battery SOC % and riding behavior.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ECO', 'NORMAL', 'SPORT'].map(mode => (
              <button
                key={mode}
                onClick={() => setRidingMode(mode)}
                style={{
                  background: ridingMode === mode ? (isRoyal ? '#1d4ed8' : '#2563eb') : (isRoyal ? '#f1f5f9' : '#090d16'),
                  color: ridingMode === mode ? '#ffffff' : (isRoyal ? '#475569' : '#94a3b8'),
                  border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Battery Slider & Numerical Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isRoyal ? '#475569' : '#cbd5e1' }}>
                Current State of Charge (SOC):
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isCritical ? '#dc2626' : '#00d293' }}>
                {predBattery}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={predBattery}
              onChange={(e) => setPredBattery(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: isCritical ? '#dc2626' : '#00d293',
                cursor: 'pointer',
                height: '6px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              <span>0% (Empty)</span>
              <span>50%</span>
              <span>100% (Full)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: isRoyal ? '#f8fafc' : '#090d16', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>Predicted Range</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>
                ~{estimatedKm} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>at {ridingMode} mode speed</div>
            </div>

            <div style={{ background: isRoyal ? '#f8fafc' : '#090d16', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>Safe Reach Radius</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isCritical ? '#dc2626' : '#00d293' }}>
                ~{safeRadiusKm} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>with 25% safety reserve</div>
            </div>
          </div>
        </div>

        {/* Action Recommendation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: isCritical ? '#dc2626' : (isRoyal ? '#475569' : '#cbd5e1'), fontWeight: 600 }}>
            {isCritical 
              ? '⚠️ Warning: Distance to next charging station may exceed safe range. Request mobile helper.'
              : '✅ Safe Range: Multiple public charging stations located within your safe radius.'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigate('charging')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <span>View Charging Stations</span>
            </button>
            {isCritical && (
              <button
                onClick={() => onNavigate('emergency')}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem', background: '#dc2626' }}
              >
                <span>Call Emergency Rescue</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. Key Platform Guarantees Strip */}
      <div style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(37,99,235,0.15)', borderRadius: '10px', padding: '10px', color: '#3b82f6' }}>
            <Navigation size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Automatic GPS Matching</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dynamic Haversine distance to nearest helpers</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(0,210,147,0.15)', borderRadius: '10px', padding: '10px', color: '#00d293' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Audited Helpers</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Equipment verified & ₹49 gateway registration</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245,158,11,0.15)', borderRadius: '10px', padding: '10px', color: '#f59e0b' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>15-Min Response Window</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Guaranteed response SLA or automatic auto-reassign</div>
          </div>
        </div>
      </div>

      {/* Interactive Tour Modal */}
      {showTour && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="pro-card" style={{ maxWidth: '560px', width: '100%', padding: '28px', position: 'relative' }}>
            {/* Close button */}
            <button
              onClick={() => setShowTour(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* Tour Step Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="badge-clean badge-blue">
                {tourSteps[tourStep].badge}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Slide {tourStep + 1} of {tourSteps.length}
              </span>
            </div>

            {/* Tour Slide Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                background: `${tourSteps[tourStep].accentColor}20`,
                border: `1px solid ${tourSteps[tourStep].accentColor}40`,
                borderRadius: '12px',
                padding: '12px',
                color: tourSteps[tourStep].accentColor
              }}>
                {React.createElement(tourSteps[tourStep].icon, { size: 26 })}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {tourSteps[tourStep].title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {tourSteps[tourStep].subtitle}
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px' }}>
              {tourSteps[tourStep].description}
            </p>

            {/* Progress Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setTourStep(idx)}
                  style={{
                    width: tourStep === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: tourStep === idx ? '#2563eb' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* Bottom Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setTourStep(prev => Math.max(0, prev - 1))}
                disabled={tourStep === 0}
                className="btn-secondary"
                style={{ opacity: tourStep === 0 ? 0.4 : 1, cursor: tourStep === 0 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {tourSteps[tourStep].navTarget && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = tourSteps[tourStep].navTarget;
                      setShowTour(false);
                      if (target) onNavigate(target);
                    }}
                    className="btn-secondary"
                    style={{ borderColor: '#3b82f6', color: '#60a5fa' }}
                  >
                    Open Page
                  </button>
                )}

                {tourStep < tourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setTourStep(prev => prev + 1)}
                    className="btn-primary"
                  >
                    Next Slide
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTour(false)}
                    className="btn-primary"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

