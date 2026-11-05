import React, { useState } from 'react';
import { Zap, MapPin, AlertCircle, HeartHandshake, Bike, ShieldCheck, Menu, X, User, LogOut, Lock } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const navItems = [
    { id: 'charging', label: 'Find Stations', icon: MapPin },
    { id: 'emergency', label: 'Emergency Rescue', icon: AlertCircle, highlight: true },
    { id: 'helper', label: 'Earn by Helping', icon: HeartHandshake },
    { id: 'garage', label: 'My Garage', icon: Bike },
    // Only show Admin if authenticated as Admin or show with locked badge
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, adminOnly: true }
  ];

  const handleSelect = (item) => {
    if (item.adminOnly && !isAdmin) {
      // Trigger Auth Modal with Admin role prompt
      onOpenAuth('ADMIN');
      return;
    }
    setActiveTab(item.id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('charging')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            background: '#facc15',
            border: '1.5px solid #18181b',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(250, 204, 21, 0.4)'
          }}>
            <Zap size={20} color="#18181b" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                EV Sahayak
              </span>
              <span style={{ fontSize: '0.68rem', color: '#854d0e', background: '#fef08a', border: '1.5px solid #18181b', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                BENGALURU
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Charging Network & Emergency Assistance
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '4px', alignItems: 'center' }} className="desktop-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLockedAdmin = item.adminOnly && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  background: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#ffffff' : (item.highlight ? '#facc15' : '#94a3b8'),
                  border: isActive ? '1px solid #334155' : '1px solid transparent',
                  padding: '7px 13px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? (item.highlight ? '#facc15' : '#ca8a04') : undefined} />
                <span>{item.label}</span>
                {isLockedAdmin && <Lock size={12} color="#64748b" />}
              </button>
            );
          })}
        </nav>

        {/* User Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => onOpenAuth()}
                style={{
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: currentUser.role === 'ADMIN' ? '#f59e0b' : currentUser.role === 'PROVIDER' ? '#00d293' : '#facc15',
                  color: currentUser.role === 'MEMBER' ? '#18181b' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <span className={`badge-clean ${currentUser.role === 'ADMIN' ? 'badge-amber' : currentUser.role === 'PROVIDER' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="btn-secondary"
                style={{ padding: '6px 8px', fontSize: '0.75rem', borderRadius: '8px' }}
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth()}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0b0f19',
          borderBottom: '1px solid #1e293b',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLockedAdmin = item.adminOnly && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  background: isActive ? '#1e293b' : 'transparent',
                  color: '#ffffff',
                  border: '1px solid #1e293b',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={item.highlight ? '#facc15' : '#94a3b8'} />
                  <span>{item.label}</span>
                </div>
                {isLockedAdmin && <Lock size={14} color="#64748b" />}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
