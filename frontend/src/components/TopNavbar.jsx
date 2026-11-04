import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Globe, Check, X, Shield, ChevronDown, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

export default function TopNavbar({ 
  currentUser, 
  activeTab, 
  onNavigate, 
  theme = 'royal', 
  onToggleTheme, 
  onOpenSearch,
  language = 'en',
  onLanguageChange
}) {
  const isRoyal = theme === 'royal';
  const t = translations[language] || translations.en;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 'notif_1',
      title: 'Helper En Route',
      message: 'QuickEV Assist accepted your rescue call for Indiranagar.',
      time: '12m ago',
      unread: true,
      type: 'rescue'
    },
    {
      id: 'notif_2',
      title: 'New Swappable Dock Live',
      message: 'BESCOM Fast Grid on 100ft Rd is now operational.',
      time: '1h ago',
      unread: true,
      type: 'station'
    },
    {
      id: 'notif_3',
      title: 'Pass Confirmed',
      message: '₹19 Emergency Contact Pass verified successfully.',
      time: 'Yesterday',
      unread: false,
      type: 'payment'
    }
  ];

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  const handleSelectLanguage = (code) => {
    if (onLanguageChange) onLanguageChange(code);
    setShowLangMenu(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: isRoyal ? 'rgba(255, 255, 255, 0.92)' : 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Left: GPS Live Telemetry Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isRoyal ? 'rgba(5, 150, 105, 0.08)' : 'rgba(0, 210, 147, 0.1)',
          border: isRoyal ? '1px solid rgba(5, 150, 105, 0.2)' : '1px solid rgba(0, 210, 147, 0.2)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.75rem',
          color: isRoyal ? '#059669' : '#00d293',
          fontWeight: 600
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isRoyal ? '#059669' : '#00d293', display: 'inline-block' }} />
          <span>{t.live_gps} ({currentUser?.location?.lat?.toFixed(3) || '12.971'}°N, {currentUser?.location?.lng?.toFixed(3) || '77.594'}°E)</span>
        </div>
      </div>

      {/* Right Controls: Quick Search (Icon Only) + Language + Notifications + Theme Toggle + Account Avatar in Top Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Search Button: Clean icon only, no Ctrl+K badge */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            style={{
              background: isRoyal ? '#f1f5f9' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '10px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isRoyal ? '#1d4ed8' : '#60a5fa',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={t.quick_search}
          >
            <Search size={18} />
          </button>
        )}

        {/* Local-Language Selector (P2 Local-language interface) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowNotifications(false);
            }}
            style={{
              background: isRoyal ? '#f1f5f9' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '10px',
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isRoyal ? '#1e293b' : '#cbd5e1',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Switch Language (English / ಕನ್ನಡ / हिन्दी)"
          >
            <Globe size={15} color={isRoyal ? '#1d4ed8' : '#38bdf8'} />
            <span>{languages.find(l => l.code === language)?.native || 'EN'}</span>
            <ChevronDown size={13} color="#94a3b8" />
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '160px',
              background: isRoyal ? '#ffffff' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 100,
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  style={{
                    background: language === lang.code ? (isRoyal ? '#eff6ff' : '#1e293b') : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: language === lang.code ? (isRoyal ? '#1d4ed8' : '#38bdf8') : (isRoyal ? '#334155' : '#cbd5e1'),
                    fontWeight: language === lang.code ? 700 : 500
                  }}
                >
                  <span>{lang.native} ({lang.label})</span>
                  {language === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Push Notifications Bell (P1: Push notifications) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLangMenu(false);
              setUnreadCount(0);
            }}
            style={{
              background: isRoyal ? '#f1f5f9' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '10px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: isRoyal ? '#334155' : '#cbd5e1',
              cursor: 'pointer'
            }}
            title="Push Notifications & Rescue Dispatch Alerts"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#dc2626',
                border: '1.5px solid #fff'
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '320px',
              background: isRoyal ? '#ffffff' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
              zIndex: 100,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: isRoyal ? '#0f172a' : '#fff' }}>
                  Live Notifications
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Real-time</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: isRoyal ? '#f8fafc' : '#1e293b',
                      border: isRoyal ? '1px solid #e2e8f0' : '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.8rem', color: isRoyal ? '#1d4ed8' : '#38bdf8' }}>{n.title}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isRoyal ? '#475569' : '#cbd5e1', lineHeight: '1.3' }}>
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle (Royal Light vs Obsidian Dark) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              background: isRoyal ? '#eff6ff' : '#0f172a',
              border: isRoyal ? '1px solid #bfdbfe' : '1px solid #1e293b',
              borderRadius: '10px',
              padding: '7px 12px',
              color: isRoyal ? '#1d4ed8' : '#fbbf24',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
            title={isRoyal ? 'Switch to Obsidian Dark Theme' : 'Switch to Royal Theme (White, Red & Blue)'}
          >
            {isRoyal ? <Moon size={16} color="#1d4ed8" /> : <Sun size={16} color="#fbbf24" />}
            <span style={{ display: 'none', sm: 'inline' }}>{isRoyal ? 'Royal' : 'Dark'}</span>
          </button>
        )}

        {/* Admin Console Switcher (visible for ADMIN users) */}
        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('admin')}
            style={{
              background: '#f59e0b',
              color: '#000000',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Open Admin Command Center"
          >
            <ShieldCheck size={14} />
            <span>Admin</span>
          </button>
        )}

        {/* Account Logo & Profile Link (Top Right Corner) */}
        <button
          onClick={() => onNavigate('profile')}
          style={{
            background: activeTab === 'profile' 
              ? (isRoyal ? 'rgba(29, 78, 216, 0.12)' : 'rgba(37, 99, 235, 0.25)') 
              : (isRoyal ? '#ffffff' : '#0f172a'),
            border: activeTab === 'profile'
              ? (isRoyal ? '2px solid #1d4ed8' : '2px solid #3b82f6')
              : (isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b'),
            borderRadius: '12px',
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="My Profile, EV Garage, and History"
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: isRoyal ? '#1d4ed8' : '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800
          }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ textAlign: 'left', display: 'none', sm: 'block' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isRoyal ? '#0f172a' : '#ffffff', lineHeight: 1.2 }}>
              {currentUser?.name || 'Account'}
            </div>
            <div style={{ fontSize: '0.68rem', color: isRoyal ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
              {t.nav_profile}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
