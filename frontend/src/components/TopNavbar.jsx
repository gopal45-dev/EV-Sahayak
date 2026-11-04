import React from 'react';
import { Search, Sun, Moon, User, Navigation, Shield, ChevronDown, Bell } from 'lucide-react';

export default function TopNavbar({ 
  currentUser, 
  activeTab, 
  onNavigate, 
  theme = 'royal', 
  onToggleTheme, 
  onOpenSearch 
}) {
  const isRoyal = theme === 'royal';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: isRoyal ? 'rgba(255, 255, 255, 0.9)' : 'rgba(9, 13, 22, 0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Left: Current Section Breadcrumb / GPS status */}
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
          <span>Live GPS Active ({currentUser?.location?.lat?.toFixed(3)}°N, {currentUser?.location?.lng?.toFixed(3)}°E)</span>
        </div>
      </div>

      {/* Right Controls: Quick Search + Theme Toggle + Account Avatar in Top Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Search Button */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            style={{
              background: isRoyal ? '#f1f5f9' : '#0f172a',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: isRoyal ? '#64748b' : '#94a3b8',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Search any action (Ctrl+K)"
          >
            <Search size={15} color={isRoyal ? '#1d4ed8' : '#60a5fa'} />
            <span style={{ display: 'none', md: 'inline' }}>Search...</span>
            <kbd style={{
              background: isRoyal ? '#e2e8f0' : '#1e293b',
              fontSize: '0.65rem',
              padding: '2px 5px',
              borderRadius: '4px',
              color: isRoyal ? '#475569' : '#cbd5e1',
              fontWeight: 600
            }}>
              Ctrl+K
            </kbd>
          </button>
        )}

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
              Profile & Garage
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}

