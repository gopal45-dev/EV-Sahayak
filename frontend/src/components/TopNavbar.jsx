import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Globe, Check, X, Shield, ChevronDown, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

export default function TopNavbar({ 
  currentUser, 
  activeTab, 
  onNavigate, 
  theme = 'honeybee', 
  onToggleTheme, 
  onOpenSearch,
  language = 'en',
  onLanguageChange
}) {
  const isHoneybee = theme !== 'obsidian';
  const isRoyal = isHoneybee;
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
      background: isHoneybee ? 'rgba(255, 255, 255, 0.98)' : 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
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
          background: isHoneybee ? '#fefce8' : 'rgba(0, 210, 147, 0.1)',
          border: isHoneybee ? '1.5px solid #18181b' : '1px solid rgba(0, 210, 147, 0.2)',
          borderRadius: '6px',
          padding: '5px 12px',
          fontSize: '0.78rem',
          color: isHoneybee ? '#854d0e' : '#00d293',
          fontWeight: 700,
          boxShadow: isHoneybee ? '1.5px 1.5px 0px #000000' : 'none'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15', border: '1px solid #000000', display: 'inline-block' }} />
          <span>{t.live_gps} ({currentUser?.location?.lat?.toFixed(3) || '12.971'}°N, {currentUser?.location?.lng?.toFixed(3) || '77.594'}°E)</span>
        </div>
      </div>

      {/* Right Controls: Quick Search + Language + Notifications + Theme Toggle + Account Avatar in Top Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Search Button */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            style={{
              background: isHoneybee ? '#ffffff' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
              borderRadius: '8px',
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isHoneybee ? '#000000' : '#f4f4f5',
              cursor: 'pointer',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}
            title={t.quick_search}
          >
            <Search size={18} />
          </button>
        )}

        {/* Local-Language Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowNotifications(false);
            }}
            style={{
              background: isHoneybee ? '#ffffff' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
              borderRadius: '8px',
              padding: '7px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isHoneybee ? '#000000' : '#f4f4f5',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}
            title="Switch Language (English / ಕನ್ನಡ / हिन्दी)"
          >
            <Globe size={15} color={isHoneybee ? '#000000' : '#facc15'} />
            <span>{languages.find(l => l.code === language)?.native || 'EN'}</span>
            <ChevronDown size={13} color={isHoneybee ? '#000000' : '#a1a1aa'} />
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '165px',
              background: isHoneybee ? '#ffffff' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
              borderRadius: '8px',
              boxShadow: isHoneybee ? '4px 4px 0px #000000' : '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 100,
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  style={{
                    background: language === lang.code ? '#facc15' : 'transparent',
                    border: language === lang.code ? '1.5px solid #000000' : '1.5px solid transparent',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: language === lang.code ? '#000000' : (isHoneybee ? '#000000' : '#f4f4f5'),
                    fontWeight: language === lang.code ? 800 : 600,
                    boxShadow: language === lang.code && isHoneybee ? '1.5px 1.5px 0px #000000' : 'none'
                  }}
                >
                  <span>{lang.native} ({lang.label})</span>
                  {language === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Push Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLangMenu(false);
              setUnreadCount(0);
            }}
            style={{
              background: isHoneybee ? '#ffffff' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
              borderRadius: '8px',
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: isHoneybee ? '#000000' : '#cbd5e1',
              cursor: 'pointer',
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
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
                border: '1px solid #000000'
              }} />
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '320px',
              background: isHoneybee ? '#ffffff' : '#0f172a',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
              borderRadius: '8px',
              boxShadow: isHoneybee ? '4px 4px 0px #000000' : '0 12px 30px rgba(0,0,0,0.25)',
              zIndex: 100,
              padding: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: isHoneybee ? '#000000' : '#fff' }}>
                  Live Notifications
                </span>
                <span style={{ fontSize: '0.72rem', color: isHoneybee ? '#71717a' : '#64748b', fontWeight: 600 }}>Real-time</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      background: isHoneybee ? '#fafafa' : '#1e293b',
                      border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155',
                      borderRadius: '6px',
                      padding: '8px 10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: isHoneybee ? '#000000' : '#f4f4f5' }}>{n.title}</span>
                      <span style={{ fontSize: '0.68rem', color: isHoneybee ? '#71717a' : '#94a3b8' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isHoneybee ? '#52525b' : '#cbd5e1', lineHeight: '1.3' }}>
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher Toggle (Honeybee Yellow vs Obsidian Dark) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              background: isHoneybee ? '#facc15' : '#18181b',
              border: isHoneybee ? '1.5px solid #000000' : '1.5px solid #facc15',
              borderRadius: '8px',
              padding: '7px 12px',
              color: isHoneybee ? '#000000' : '#facc15',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
            }}
            title={isHoneybee ? 'Switch to Obsidian Dark Theme' : 'Switch to Honeybee Yellow Theme'}
          >
            {isHoneybee ? <Moon size={15} color="#000000" /> : <Sun size={15} color="#facc15" />}
            <span>{isHoneybee ? 'Honeybee' : 'Dark'}</span>
          </button>
        )}

        {/* Admin Console Switcher (visible for ADMIN users) */}
        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('admin')}
            style={{
              background: '#facc15',
              color: '#000000',
              border: '1.5px solid #000000',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '0.78rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '2px 2px 0px #000000'
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
              ? '#facc15'
              : (isHoneybee ? '#ffffff' : '#0f172a'),
            border: activeTab === 'profile' ? '2px solid #000000' : '1.5px solid #18181b',
            borderRadius: '8px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: isHoneybee ? '2px 2px 0px #000000' : 'none'
          }}
          title="My Profile, EV Garage, and History"
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#000000',
            color: '#facc15',
            border: '1px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 900
          }}>
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ textAlign: 'left', display: 'none', sm: 'block' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isHoneybee ? '#000000' : '#ffffff', lineHeight: 1.2 }}>
              {currentUser?.name || 'Account'}
            </div>
            <div style={{ fontSize: '0.68rem', color: isHoneybee ? '#ca8a04' : '#94a3b8', fontWeight: 700 }}>
              {t.nav_profile}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
