import React, { useState, Suspense, lazy } from 'react';
import { 
  Zap, AlertCircle, MapPin, HeartHandshake, Bike, 
  ShieldCheck, Navigation, ArrowRight, BatteryCharging, 
  Clock, Sparkles, CheckCircle2, ChevronRight, HelpCircle, X, ExternalLink, RotateCw, Video,
  Activity, Cpu, Wrench, Search, Check
} from 'lucide-react';
import { translations } from '../translations';

const ThreeVisualizer = lazy(() => import('./ThreeVisualizer'));

export default function UserDashboard({ 
  currentUser, 
  vehicles = [], 
  stations = [], 
  helpers = [], 
  onNavigate,
  theme = 'obsidian',
  isTourOpen = false,
  setIsTourOpen,
  language = 'en'
}) {
  const [internalTourOpen, setInternalTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const t = translations[language] || translations.en;

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

  // Battery State-of-Health (SOH) Telemetry State
  const [sohData] = useState({
    sohPercent: 96.4,
    healthStatus: 'OPTIMAL',
    retainedCapacityKwh: 3.57,
    totalCapacityKwh: 3.70,
    estimatedLifecycleRemainingKm: 47500,
    cycleCount: 312,
    cellDeltaMv: 11,
    tempCelsius: 28.5
  });

  // Indian EV Diagnostic Trouble Code (DTC) State
  const [dtcCode, setDtcCode] = useState('ATHER-36');
  const [dtcResult, setDtcResult] = useState({
    code: 'ATHER-36',
    diagnostic: {
      brand: 'Ather Energy',
      severity: 'WARNING',
      title: 'Motor Controller Thermal Threshold',
      description: 'Motor temperature sensor detected elevated temp following continuous sport mode riding.',
      actionableSteps: [
        'Park in shaded area and turn key/dash off for 7-10 minutes.',
        'Avoid hill climbs immediately after rebooting.',
        'If warning persists after cooling, request Sahayak mobile boost or flatbed.'
      ]
    }
  });
  const [dtcLoading, setDtcLoading] = useState(false);

  const handleLookupDtc = async (codeToLookup) => {
    const code = (codeToLookup || dtcCode).trim();
    if (!code) return;
    setDtcLoading(true);
    try {
      const res = await fetch(`/api/features/dtc/${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.success) {
        setDtcResult(data);
        if (codeToLookup) setDtcCode(codeToLookup);
      }
    } catch (err) {
      console.error('Error fetching DTC:', err);
    } finally {
      setDtcLoading(false);
    }
  };

  const tourSteps = [
    {
      title: t.tour_step_0_title,
      subtitle: t.tour_step_0_sub,
      description: t.tour_step_0_desc,
      icon: Zap,
      accentColor: '#2563eb',
      badge: 'Getting Started',
      actionText: t.next_slide,
      navTarget: null
    },
    {
      title: t.tour_step_1_title,
      subtitle: t.tour_step_1_sub,
      description: t.tour_step_1_desc,
      icon: Bike,
      accentColor: '#3b82f6',
      badge: 'Essential Setup',
      actionText: 'Go to Profile & EV Garage',
      navTarget: 'profile'
    },
    {
      title: t.tour_step_2_title,
      subtitle: t.tour_step_2_sub,
      description: t.tour_step_2_desc,
      icon: AlertCircle,
      accentColor: '#f43f5e',
      badge: 'SOS Rescue',
      actionText: 'View Emergency Rescue',
      navTarget: 'emergency'
    },
    {
      title: t.tour_step_3_title,
      subtitle: t.tour_step_3_sub,
      description: t.tour_step_3_desc,
      icon: MapPin,
      accentColor: '#00d293',
      badge: 'Free Directory',
      actionText: 'Explore Stations',
      navTarget: 'charging'
    },
    {
      title: t.tour_step_4_title,
      subtitle: t.tour_step_4_sub,
      description: t.tour_step_4_desc,
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
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: isRoyal ? 'radial-gradient(circle, rgba(29, 78, 216, 0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Left Column: Greeting & Platform Context */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: isRoyal ? 'rgba(29, 78, 216, 0.08)' : 'rgba(59, 130, 246, 0.15)', 
              border: isRoyal ? '1px solid rgba(29, 78, 216, 0.25)' : '1px solid rgba(59, 130, 246, 0.3)', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.78rem', 
              color: isRoyal ? '#1d4ed8' : '#60a5fa', 
              fontWeight: 600, 
              marginBottom: '12px' 
            }}>
              <Sparkles size={14} />
              <span>{t.welcome_subtitle}</span>
            </div>

            <h1 style={{ 
              fontSize: '1.95rem', 
              fontWeight: 800, 
              color: isRoyal ? '#0f172a' : '#ffffff', 
              marginBottom: '8px', 
              letterSpacing: '-0.02em' 
            }}>
              {t.welcome_title}, {currentUser?.name || 'EV Rider'}
            </h1>

            <p style={{ 
              fontSize: '0.92rem', 
              color: isRoyal ? '#475569' : '#cbd5e1', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            }}>
              {t.welcome_desc}
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
                <span>{t.live_gps}: {currentUser?.location?.lat?.toFixed(3) || '12.971'}°N, {currentUser?.location?.lng?.toFixed(3) || '77.594'}°E</span>
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
                <span>{vehicles.length > 0 ? `${vehicles.length} EV (${vehicles[0].brand})` : t.nav_profile}</span>
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
                <span>{activeHelpersCount} {t.nav_helper}</span>
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
                <span>{t.interactive_tour_btn}</span>
              </button>
              <span style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                {t.tour_pill}
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
        marginBottom: '28px',
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
              {t.sos_title}
            </div>
            <div style={{ fontSize: '0.82rem', color: isRoyal ? '#475569' : '#cbd5e1', marginTop: '2px' }}>
              {t.sos_desc}
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
          <span>{t.sos_btn}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 3. Interactive Walkthrough & Pitch Slides Action Banner */}
      <div className="pro-card" style={{
        padding: '18px 24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: isRoyal 
          ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' 
          : 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, #0f172a 100%)',
        border: isRoyal ? '1px solid #bfdbfe' : '1px solid rgba(37, 99, 235, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '680px' }}>
          <div style={{
            background: isRoyal ? '#1d4ed8' : '#2563eb',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isRoyal ? '0 4px 12px rgba(29, 78, 216, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isRoyal ? '#0f172a' : '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t.walkthrough_title}</span>
              <span className="badge-clean badge-blue" style={{ fontSize: '0.68rem' }}>{t.walkthrough_badge}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: isRoyal ? '#475569' : '#cbd5e1', marginTop: '3px' }}>
              {t.walkthrough_desc}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setTourStep(0);
            setShowTour(true);
          }}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={16} />
          <span>{t.walkthrough_btn}</span>
        </button>
      </div>

      {/* 4. Predictive Battery & Safe Radius Assistance (Future PRD Requirement) */}
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
                {t.pred_title}
              </h3>
              <span className={`badge-clean ${isCritical ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                {isCritical ? t.critical_reserve : t.telemetry_active}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
              {t.pred_subtitle} ({activeVehicle.brand} {activeVehicle.modelName})
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
                {t.soc_label}
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
              <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>{t.predicted_range}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>
                ~{estimatedKm} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{ridingMode} {t.mode_speed_note}</div>
            </div>

            <div style={{ background: isRoyal ? '#f8fafc' : '#090d16', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>{t.safe_radius}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isCritical ? '#dc2626' : '#00d293' }}>
                ~{safeRadiusKm} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.safety_reserve_note}</div>
            </div>
          </div>
        </div>

        {/* Action Recommendation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b', flexWrap: 'gap', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: isCritical ? '#dc2626' : (isRoyal ? '#475569' : '#cbd5e1'), fontWeight: 600 }}>
            {isCritical ? t.warning_critical : t.safe_range_ok}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigate('charging')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <span>{t.view_stations_btn}</span>
            </button>
            {isCritical && (
              <button
                onClick={() => onNavigate('emergency')}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem', background: '#dc2626' }}
              >
                <span>{t.call_rescue_btn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4B & 4C: Battery Health Degradation & Indian EV Diagnostic Troubleshooter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Card 1: Battery SOH & Degradation Telemetry */}
        <div className="pro-card" style={{
          padding: '22px 24px',
          background: isRoyal ? '#ffffff' : '#090d16',
          border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#00d293" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                {t.battery_soh_title}
              </h3>
            </div>
            <span className="badge-clean badge-green" style={{ fontSize: '0.68rem' }}>
              GRADE A • {sohData.healthStatus}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: isRoyal ? '#64748b' : '#94a3b8', marginBottom: '16px', lineHeight: '1.5' }}>
            Bengaluru ambient thermal model for {activeVehicle.brand} ({activeVehicle.modelName || 'EV'}). Real-time cell telemetry & capacity retention.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: isRoyal ? '#f8fafc' : '#0f172a', padding: '12px 14px', borderRadius: '10px', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>State of Health</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#00d293', fontFamily: 'var(--font-mono)' }}>
                {sohData.sohPercent}%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                {sohData.retainedCapacityKwh} / {sohData.totalCapacityKwh} kWh
              </div>
            </div>

            <div style={{ background: isRoyal ? '#f8fafc' : '#0f172a', padding: '12px 14px', borderRadius: '10px', border: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>{t.lifecycle_est}</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: isRoyal ? '#1d4ed8' : '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                ~{sohData.estimatedLifecycleRemainingKm.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                {sohData.cycleCount} charge cycles
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: isRoyal ? '#475569' : '#cbd5e1', paddingTop: '10px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
            <span>Pack Temp: <b style={{ color: '#00d293' }}>{sohData.tempCelsius}°C</b></span>
            <span>Cell Delta: <b style={{ color: '#00d293' }}>&lt; {sohData.cellDeltaMv} mV</b></span>
            <span>{t.cell_condition}</span>
          </div>
        </div>

        {/* Card 2: Indian EV Diagnostic Trouble Code (DTC) Decoder */}
        <div className="pro-card" style={{
          padding: '22px 24px',
          background: isRoyal ? '#ffffff' : '#090d16',
          border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                {t.dtc_title}
              </h3>
            </div>
            <span className="badge-clean badge-blue" style={{ fontSize: '0.68rem' }}>
              INDIAN 2W/4W
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: isRoyal ? '#64748b' : '#94a3b8', marginBottom: '12px' }}>
            {t.dtc_desc}
          </p>

          {/* Quick Code Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['ATHER-36', 'OLA-21', 'VIDA-14', 'TVS-09'].map(code => (
              <button
                key={code}
                onClick={() => handleLookupDtc(code)}
                style={{
                  background: dtcCode === code ? (isRoyal ? '#1d4ed8' : '#2563eb') : (isRoyal ? '#f1f5f9' : '#0f172a'),
                  color: dtcCode === code ? '#ffffff' : (isRoyal ? '#475569' : '#94a3b8'),
                  border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              placeholder="Enter dash code (e.g. ATHER-36)..."
              value={dtcCode}
              onChange={(e) => setDtcCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleLookupDtc()}
              className="input-pro"
              style={{ fontSize: '0.8rem', padding: '6px 12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
            />
            <button
              onClick={() => handleLookupDtc()}
              disabled={dtcLoading}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
            >
              {dtcLoading ? <RotateCw size={14} className="animate-spin" /> : <Search size={14} />}
              <span>{t.dtc_lookup}</span>
            </button>
          </div>

          {/* Result Drawer */}
          {dtcResult?.diagnostic && (
            <div style={{
              background: isRoyal ? '#f8fafc' : '#0f172a',
              border: `1px solid ${dtcResult.diagnostic.severity === 'CRITICAL' ? '#dc2626' : (dtcResult.diagnostic.severity === 'WARNING' ? '#f59e0b' : '#3b82f6')}`,
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>
                  {dtcResult.diagnostic.title}
                </span>
                <span className={`badge-clean ${dtcResult.diagnostic.severity === 'CRITICAL' ? 'badge-amber' : (dtcResult.diagnostic.severity === 'WARNING' ? 'badge-amber' : 'badge-blue')}`} style={{ fontSize: '0.65rem' }}>
                  {dtcResult.diagnostic.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: isRoyal ? '#475569' : '#94a3b8', marginBottom: '8px', lineHeight: '1.4' }}>
                {dtcResult.diagnostic.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: isRoyal ? '#1e293b' : '#cbd5e1' }}>
                {dtcResult.diagnostic.actionableSteps?.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: '#00d293', fontWeight: 700 }}>{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Key Platform Guarantees Strip */}
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
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>{t.guarantee_gps_title}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.guarantee_gps_desc}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(0,210,147,0.15)', borderRadius: '10px', padding: '10px', color: '#00d293' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>{t.guarantee_audit_title}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.guarantee_audit_desc}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245,158,11,0.15)', borderRadius: '10px', padding: '10px', color: '#f59e0b' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>{t.guarantee_sla_title}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.guarantee_sla_desc}</div>
          </div>
        </div>
      </div>

      {/* Interactive Tour & Pitch Slides Modal */}
      {showTour && (
        <div className="modal-overlay" style={{ zIndex: 120 }}>
          <div className="pro-card" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            background: isRoyal ? '#ffffff' : '#0f172a',
            border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowTour(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: isRoyal ? '#64748b' : '#94a3b8',
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
              <span style={{ fontSize: '0.78rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                {t.slide_prefix} {tourStep + 1} {t.of} {tourSteps.length}
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                  {tourSteps[tourStep].title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                  {tourSteps[tourStep].subtitle}
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: isRoyal ? '#475569' : '#cbd5e1', lineHeight: '1.6', marginBottom: '18px' }}>
              {tourSteps[tourStep].description}
            </p>

            {/* Pitch Video Placeholder */}
            <div style={{
              background: isRoyal ? '#f8fafc' : '#090d16',
              border: isRoyal ? '1px dashed #cbd5e1' : '1px dashed #334155',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(37, 99, 235, 0.2)',
                color: isRoyal ? '#1d4ed8' : '#38bdf8',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex'
              }}>
                <Video size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isRoyal ? '#0f172a' : '#ffffff' }}>
                  {t.video_slot_title}
                </div>
                <div style={{ fontSize: '0.72rem', color: isRoyal ? '#64748b' : '#94a3b8' }}>
                  {t.video_slot_desc}
                </div>
              </div>
            </div>

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
                    background: tourStep === idx ? (isRoyal ? '#1d4ed8' : '#2563eb') : (isRoyal ? '#cbd5e1' : '#334155'),
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
                {t.prev_slide}
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
                    style={{ borderColor: isRoyal ? '#1d4ed8' : '#3b82f6', color: isRoyal ? '#1d4ed8' : '#60a5fa' }}
                  >
                    {t.open_page}
                  </button>
                )}

                {tourStep < tourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setTourStep(prev => prev + 1)}
                    className="btn-primary"
                  >
                    {t.next_slide}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTour(false)}
                    className="btn-primary"
                  >
                    {t.get_started}
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
