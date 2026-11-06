import React, { useState, Suspense, lazy } from 'react';
import { 
  Zap, AlertCircle, MapPin, HeartHandshake, Bike, 
  ShieldCheck, Navigation, ArrowRight, BatteryCharging, 
  Clock, Sparkles, CheckCircle2, ChevronRight, HelpCircle, X, ExternalLink, RotateCw, Video,
  Activity, Cpu, Wrench, Search, Check
} from 'lucide-react';
import { translations } from '../translations';
import { API_BASE_URL } from '../config/api';

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

  const isHoneybee = theme !== 'obsidian';
  const isRoyal = isHoneybee;
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
      const res = await fetch(`${API_BASE_URL}/api/features/dtc/${encodeURIComponent(code)}`);
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
      accentColor: '#eab308',
      badge: 'Getting Started',
      actionText: t.next_slide,
      navTarget: null
    },
    {
      title: t.tour_step_1_title,
      subtitle: t.tour_step_1_sub,
      description: t.tour_step_1_desc,
      icon: Bike,
      accentColor: '#ca8a04',
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
      {/* 1. Welcome & 3D Interactive Hero Banner in Honeybee Yellow & Black Margin Lines */}
      <div style={{
        background: isRoyal ? '#ffffff' : '#121215',
        border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #27272a',
        borderLeft: '8px solid #facc15',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: isRoyal ? '4px 4px 0px #000000' : '4px 4px 0px #000000',
        position: 'relative'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
          {/* Left Column: Greeting & Platform Context */}
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#fef08a', 
              border: '1.5px solid #000000', 
              padding: '4px 12px', 
              borderRadius: '6px', 
              fontSize: '0.78rem', 
              color: '#000000', 
              fontWeight: 800, 
              marginBottom: '12px' 
            }}>
              <Zap size={14} color="#000000" />
              <span>{t.welcome_subtitle}</span>
            </div>

            <h1 style={{ 
              fontSize: '2.1rem', 
              fontWeight: 900, 
              color: isRoyal ? '#000000' : '#ffffff', 
              marginBottom: '8px', 
              letterSpacing: '-0.03em' 
            }}>
              {t.welcome_title}, {currentUser?.name || 'EV Rider'}
            </h1>

            <p style={{ 
              fontSize: '0.92rem', 
              color: isRoyal ? '#52525b' : '#cbd5e1', 
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
                background: isRoyal ? '#ffffff' : '#18181b',
                border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: isRoyal ? '#000000' : '#facc15',
                fontWeight: 700
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15', border: '1px solid #000000' }} />
                <span>{t.live_gps}: {currentUser?.location?.lat?.toFixed(3) || '12.971'}°N, {currentUser?.location?.lng?.toFixed(3) || '77.594'}°E</span>
              </div>

              {/* Garage Status (opens profile) */}
              <div 
                onClick={() => onNavigate('profile')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isRoyal ? '#ffffff' : '#18181b',
                  border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: isRoyal ? '#000000' : '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Bike size={14} color="#facc15" />
                <span>{vehicles.length > 0 ? `${vehicles.length} EV (${vehicles[0].brand})` : t.nav_profile}</span>
              </div>

              {/* Active Helpers */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: isRoyal ? '#fefce8' : '#18181b',
                border: isRoyal ? '1.5px solid #ca8a04' : '1.5px solid #eab308',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: isRoyal ? '#854d0e' : '#facc15',
                fontWeight: 700
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
            background: isRoyal ? '#f8fafc' : '#18181b',
            border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            minHeight: '230px'
          }}>
            <Suspense fallback={
              <div style={{ minHeight: '210px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '8px' }}>
                <RotateCw size={24} className="animate-spin" color="#facc15" />
                <span style={{ fontSize: '0.78rem' }}>Loading 3D Core...</span>
              </div>
            }>
              <ThreeVisualizer theme={theme} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 2. Urgent Roadside SOS Card in High-Visibility Safety Styling */}
      <div style={{
        background: isRoyal ? '#ffffff' : '#121215',
        border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #27272a',
        borderLeft: '8px solid #dc2626',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: isRoyal ? '4px 4px 0px #000000' : '4px 4px 0px #000000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
          <div style={{
            background: '#fee2e2',
            border: '1.5px solid #dc2626',
            borderRadius: '10px',
            padding: '12px',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isRoyal ? '#000000' : '#ffffff' }}>
              {t.sos_title}
            </div>
            <div style={{ fontSize: '0.82rem', color: isRoyal ? '#52525b' : '#a1a1aa', marginTop: '2px' }}>
              {t.sos_desc}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('emergency')}
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: '1.5px solid #000000',
            borderRadius: '8px',
            padding: '12px 22px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '3px 3px 0px #000000',
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
        background: isRoyal ? '#ffffff' : '#121215',
        border: isRoyal ? '1.5px solid #18181b' : '1.5px solid #27272a',
        borderLeft: '8px solid #facc15',
        boxShadow: isRoyal ? '3px 3px 0px #000000' : '3px 3px 0px #000000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '680px' }}>
          <div style={{
            background: '#fef08a',
            color: '#000000',
            border: '1.5px solid #000000',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isRoyal ? '#000000' : '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t.walkthrough_title}</span>
              <span className="badge-clean badge-yellow" style={{ fontSize: '0.68rem' }}>{t.walkthrough_badge}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: isRoyal ? '#52525b' : '#a1a1aa', marginTop: '3px' }}>
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
          ? (isHoneybee ? '#fff1f2' : 'rgba(239, 68, 68, 0.08)') 
          : (isHoneybee ? '#ffffff' : '#0f172a'),
        border: isHoneybee 
          ? (isCritical ? '2px solid #dc2626' : '1.5px solid #18181b')
          : (isCritical ? '1px solid #dc2626' : '1px solid #1e293b'),
        boxShadow: isHoneybee ? '3px 3px 0px #000000' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <BatteryCharging size={20} color={isCritical ? '#dc2626' : (isHoneybee ? '#ca8a04' : '#00d293')} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff' }}>
                {t.pred_title}
              </h3>
              <span className={`badge-clean ${isCritical ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                {isCritical ? t.critical_reserve : t.telemetry_active}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
              {t.pred_subtitle} ({activeVehicle.brand} {activeVehicle.modelName})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ECO', 'NORMAL', 'SPORT'].map(mode => (
              <button
                key={mode}
                onClick={() => setRidingMode(mode)}
                style={{
                  background: ridingMode === mode ? '#facc15' : (isHoneybee ? '#f4f4f5' : '#18181b'),
                  color: ridingMode === mode ? '#000000' : (isHoneybee ? '#000000' : '#f4f4f5'),
                  border: isHoneybee ? '1.5px solid #000000' : (ridingMode === mode ? '1.5px solid #facc15' : '1.5px solid #27272a'),
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: ridingMode === mode && isHoneybee ? '2px 2px 0px #000000' : 'none'
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
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isHoneybee ? '#18181b' : '#f4f4f5' }}>
                {t.soc_label}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: isCritical ? '#dc2626' : (isHoneybee ? '#000000' : '#facc15') }}>
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
                accentColor: isCritical ? '#dc2626' : '#eab308',
                cursor: 'pointer',
                height: '8px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: isHoneybee ? '#71717a' : '#a1a1aa', marginTop: '4px', fontWeight: 600 }}>
              <span>0% (Empty)</span>
              <span>50%</span>
              <span>100% (Full)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ 
              background: isHoneybee ? '#ffffff' : '#121215', 
              border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a', 
              borderRadius: '8px', 
              padding: '14px',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}>
              <div style={{ fontSize: '0.72rem', color: isHoneybee ? '#71717a' : '#a1a1aa', fontWeight: 700, textTransform: 'uppercase' }}>{t.predicted_range}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isHoneybee ? '#000000' : '#f4f4f5' }}>
                ~{estimatedKm} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: isHoneybee ? '#52525b' : '#a1a1aa' }}>{ridingMode} {t.mode_speed_note}</div>
            </div>

            <div style={{ 
              background: isHoneybee ? '#ffffff' : '#121215', 
              border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a', 
              borderRadius: '8px', 
              padding: '14px',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}>
              <div style={{ fontSize: '0.72rem', color: isHoneybee ? '#71717a' : '#a1a1aa', fontWeight: 700, textTransform: 'uppercase' }}>{t.safe_radius}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isCritical ? '#dc2626' : (isHoneybee ? '#ca8a04' : '#facc15') }}>
                ~{safeRadiusKm} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: isHoneybee ? '#52525b' : '#a1a1aa' }}>{t.safety_reserve_note}</div>
            </div>
          </div>
        </div>

        {/* Action Recommendation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.82rem', color: isCritical ? '#dc2626' : (isHoneybee ? '#18181b' : '#f4f4f5'), fontWeight: 700 }}>
            {isCritical ? t.warning_critical : t.safe_range_ok}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigate('charging')}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <span>{t.view_stations_btn}</span>
            </button>
            {isCritical && (
              <button
                onClick={() => onNavigate('emergency')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#dc2626', color: '#ffffff' }}
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
          background: isHoneybee ? '#ffffff' : '#090d16',
          border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
          boxShadow: isHoneybee ? '3px 3px 0px #000000' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color={isHoneybee ? '#ca8a04' : '#facc15'} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#f4f4f5' }}>
                {t.battery_soh_title}
              </h3>
            </div>
            <span className="badge-clean badge-green" style={{ fontSize: '0.68rem' }}>
              GRADE A • {sohData.healthStatus}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: isHoneybee ? '#52525b' : '#a1a1aa', marginBottom: '16px', lineHeight: '1.5' }}>
            Bengaluru ambient thermal model for {activeVehicle.brand} ({activeVehicle.modelName || 'EV'}). Real-time cell telemetry & capacity retention.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: isHoneybee ? '#fafafa' : '#18181b', padding: '12px 14px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a' }}>
              <div style={{ fontSize: '0.7rem', color: isHoneybee ? '#71717a' : '#a1a1aa', fontWeight: 600 }}>State of Health</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isHoneybee ? '#166534' : '#00d293', fontFamily: 'var(--font-mono)' }}>
                {sohData.sohPercent}%
              </div>
              <div style={{ fontSize: '0.68rem', color: isHoneybee ? '#71717a' : '#a1a1aa', marginTop: '2px' }}>
                {sohData.retainedCapacityKwh} / {sohData.totalCapacityKwh} kWh
              </div>
            </div>

            <div style={{ background: isHoneybee ? '#fafafa' : '#18181b', padding: '12px 14px', borderRadius: '8px', border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a' }}>
              <div style={{ fontSize: '0.7rem', color: isHoneybee ? '#71717a' : '#a1a1aa', fontWeight: 600 }}>{t.lifecycle_est}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isHoneybee ? '#000000' : '#f4f4f5', fontFamily: 'var(--font-mono)' }}>
                ~{sohData.estimatedLifecycleRemainingKm.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>km</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: isHoneybee ? '#71717a' : '#a1a1aa', marginTop: '2px' }}>
                {sohData.cycleCount} charge cycles
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: isHoneybee ? '#18181b' : '#f4f4f5', paddingTop: '10px', borderTop: isHoneybee ? '1.5px solid #e4e4e7' : '1px solid #1e293b', fontWeight: 600 }}>
            <span>Pack Temp: <b style={{ color: isHoneybee ? '#ca8a04' : '#facc15' }}>{sohData.tempCelsius}°C</b></span>
            <span>Cell Delta: <b style={{ color: isHoneybee ? '#166534' : '#00d293' }}>&lt; {sohData.cellDeltaMv} mV</b></span>
            <span style={{ color: isHoneybee ? '#52525b' : '#a1a1aa' }}>{t.cell_condition}</span>
          </div>
        </div>

        {/* Card 2: Indian EV Diagnostic Trouble Code (DTC) Decoder */}
        <div className="pro-card" style={{
          padding: '22px 24px',
          background: isHoneybee ? '#ffffff' : '#121215',
          border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a',
          boxShadow: isHoneybee ? '3px 3px 0px #000000' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color={isHoneybee ? '#000000' : '#facc15'} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#f4f4f5' }}>
                {t.dtc_title}
              </h3>
            </div>
            <span className="badge-clean badge-yellow" style={{ fontSize: '0.68rem' }}>
              INDIAN 2W/4W
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: isHoneybee ? '#52525b' : '#a1a1aa', marginBottom: '12px' }}>
            {t.dtc_desc}
          </p>

          {/* Quick Code Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['ATHER-36', 'OLA-21', 'VIDA-14', 'TVS-09'].map(code => (
              <button
                key={code}
                onClick={() => handleLookupDtc(code)}
                style={{
                  background: dtcCode === code ? '#facc15' : (isHoneybee ? '#f4f4f5' : '#18181b'),
                  color: dtcCode === code ? '#000000' : (isHoneybee ? '#000000' : '#f4f4f5'),
                  border: isHoneybee ? (dtcCode === code ? '1.5px solid #000000' : '1.5px solid #18181b') : (dtcCode === code ? '1.5px solid #facc15' : '1px solid #27272a'),
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: dtcCode === code ? 800 : 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: dtcCode === code && isHoneybee ? '1.5px 1.5px 0px #000000' : 'none'
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
              style={{ fontSize: '0.8rem', padding: '8px 12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155' }}
            />
            <button
              onClick={() => handleLookupDtc()}
              disabled={dtcLoading}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              {dtcLoading ? <RotateCw size={14} className="animate-spin" /> : <Search size={14} />}
              <span>{t.dtc_lookup}</span>
            </button>
          </div>

          {/* Result Drawer */}
          {dtcResult?.diagnostic && (
            <div style={{
              background: isHoneybee ? '#fefce8' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : `1px solid ${dtcResult.diagnostic.severity === 'CRITICAL' ? '#dc2626' : (dtcResult.diagnostic.severity === 'WARNING' ? '#f59e0b' : '#ca8a04')}`,
              borderRadius: '8px',
              padding: '12px 14px',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isHoneybee ? '#000000' : '#ffffff' }}>
                  {dtcResult.diagnostic.title}
                </span>
                <span className={`badge-clean ${dtcResult.diagnostic.severity === 'CRITICAL' ? 'badge-amber' : (dtcResult.diagnostic.severity === 'WARNING' ? 'badge-amber' : 'badge-yellow')}`} style={{ fontSize: '0.65rem' }}>
                  {dtcResult.diagnostic.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8', marginBottom: '8px', lineHeight: '1.4' }}>
                {dtcResult.diagnostic.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', color: isHoneybee ? '#18181b' : '#cbd5e1' }}>
                {dtcResult.diagnostic.actionableSteps?.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: isHoneybee ? '#ca8a04' : '#00d293', fontWeight: 800 }}>{idx + 1}.</span>
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
        background: isHoneybee ? '#ffffff' : '#0f172a',
        border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
        borderRadius: '10px',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        boxShadow: isHoneybee ? '3px 3px 0px #000000' : 'none',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: '#fef08a', 
            border: '1.5px solid #18181b',
            borderRadius: '8px', 
            padding: '10px', 
            color: '#854d0e',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <Navigation size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isHoneybee ? '#000000' : '#ffffff' }}>{t.guarantee_gps_title}</div>
            <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{t.guarantee_gps_desc}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: isHoneybee ? '#dcfce7' : 'rgba(0,210,147,0.15)', 
            border: isHoneybee ? '1.5px solid #18181b' : 'none',
            borderRadius: '8px', 
            padding: '10px', 
            color: isHoneybee ? '#166534' : '#00d293',
            boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isHoneybee ? '#000000' : '#ffffff' }}>{t.guarantee_audit_title}</div>
            <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{t.guarantee_audit_desc}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: isHoneybee ? '#ffedd5' : 'rgba(245,158,11,0.15)', 
            border: isHoneybee ? '1.5px solid #18181b' : 'none',
            borderRadius: '8px', 
            padding: '10px', 
            color: isHoneybee ? '#9a3412' : '#f59e0b',
            boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
          }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isHoneybee ? '#000000' : '#ffffff' }}>{t.guarantee_sla_title}</div>
            <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>{t.guarantee_sla_desc}</div>
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
            background: isHoneybee ? '#ffffff' : '#0f172a',
            border: isHoneybee ? '2px solid #000000' : '1px solid #1e293b',
            boxShadow: isHoneybee ? '6px 6px 0px #000000' : 'none'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowTour(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: isHoneybee ? '#f4f4f5' : 'transparent',
                border: isHoneybee ? '1.5px solid #18181b' : 'none',
                borderRadius: '6px',
                padding: '4px',
                color: isHoneybee ? '#000000' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Tour Step Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="badge-clean badge-yellow">
                {tourSteps[tourStep].badge}
              </span>
              <span style={{ fontSize: '0.78rem', color: isHoneybee ? '#71717a' : '#94a3b8', fontWeight: 600 }}>
                {t.slide_prefix} {tourStep + 1} {t.of} {tourSteps.length}
              </span>
            </div>

            {/* Tour Slide Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                background: isHoneybee ? '#fef08a' : `${tourSteps[tourStep].accentColor}20`,
                border: isHoneybee ? '1.5px solid #18181b' : `1px solid ${tourSteps[tourStep].accentColor}40`,
                borderRadius: '10px',
                padding: '12px',
                color: isHoneybee ? '#854d0e' : tourSteps[tourStep].accentColor,
                boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
              }}>
                {React.createElement(tourSteps[tourStep].icon, { size: 26 })}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isHoneybee ? '#000000' : '#ffffff' }}>
                  {tourSteps[tourStep].title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: isHoneybee ? '#52525b' : '#94a3b8' }}>
                  {tourSteps[tourStep].subtitle}
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: isHoneybee ? '#27272a' : '#cbd5e1', lineHeight: '1.6', marginBottom: '18px' }}>
              {tourSteps[tourStep].description}
            </p>

            {/* Pitch Video Placeholder */}
            <div style={{
              background: isHoneybee ? '#fafafa' : '#090d16',
              border: isHoneybee ? '1.5px dashed #71717a' : '1px dashed #334155',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#fef08a',
                border: '1.5px solid #18181b',
                color: '#000000',
                borderRadius: '6px',
                padding: '8px',
                display: 'flex'
              }}>
                <Video size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff' }}>
                  {t.video_slot_title}
                </div>
                <div style={{ fontSize: '0.72rem', color: isHoneybee ? '#71717a' : '#94a3b8' }}>
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
                    background: tourStep === idx ? '#facc15' : (isHoneybee ? '#e4e4e7' : '#334155'),
                    border: tourStep === idx ? '1.5px solid #000000' : 'none',
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
                    style={{ borderColor: isHoneybee ? '#18181b' : '#3f3f46', color: isHoneybee ? '#000000' : '#f4f4f5' }}
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
