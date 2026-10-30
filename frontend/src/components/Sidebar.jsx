import React, { useState } from 'react';
import { 
  Zap, MapPin, AlertCircle, HeartHandshake, Bike, 
  ChevronLeft, ChevronRight, LogOut, Navigation, Menu, X, Shield 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'emergency', label: 'Emergency Rescue', icon: AlertCircle, highlight: true },
    { id: 'charging', label: 'Find Stations', icon: MapPin },
    { id: 'helper', label: 'Earn by Helping', icon: HeartHandshake },
    { id: 'garage', label: 'My EV Garage', icon: Bike }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar with Drawer Toggle */}
      <div className="mobile-header" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#0b0f19',
        borderBottom: '1px solid #1e293b',
        zIndex: 90,
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#2563eb',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Zap size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>EV Sahayak</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#fff',
            padding: '7px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Left Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-show' : ''}`} style={{
        width: isCollapsed ? '78px' : '260px',
        minHeight: '100vh',
        background: '#0b0f19',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Top Header & Collapse Toggle */}
        <div>
          <div style={{
            padding: isCollapsed ? '18px 12px' : '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid #1e293b'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Zap size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    EV Sahayak
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600 }}>
                    BENGALURU NETWORK
                  </div>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div style={{
                background: '#2563eb',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Zap size={20} />
              </div>
            )}

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="desktop-toggle-btn"
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#94a3b8',
                borderRadius: '8px',
                padding: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* User Profile & GPS Indicator in Sidebar */}
          {!isCollapsed && currentUser && (
            <div style={{
              margin: '16px',
              padding: '12px',
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {currentUser.name}
                  </div>
                  <span className="badge-clean badge-blue" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Live GPS Pill */}
              <div style={{
                fontSize: '0.7rem',
                color: '#00d293',
                background: 'rgba(0, 210, 147, 0.08)',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '6px'
              }}>
                <Navigation size={11} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.location?.address ? 'GPS Active' : 'Bengaluru'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    background: isActive ? '#1e293b' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    border: isActive ? '1px solid #334155' : '1px solid transparent',
                    borderRadius: '10px',
                    padding: isCollapsed ? '12px 0' : '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    transition: 'all 0.15s ease',
                    width: '100%'
                  }}
                  title={item.label}
                >
                  <Icon size={18} color={isActive ? (item.highlight ? '#38bdf8' : '#60a5fa') : undefined} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Sign Out */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: isCollapsed ? '10px 0' : '9px 12px',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .desktop-toggle-btn { display: none !important; }
          .app-sidebar {
            position: fixed !important;
            top: 60px !important;
            left: -280px !important;
            width: 260px !important;
            height: calc(100vh - 60px) !important;
            transition: left 0.25s ease !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.7) !important;
          }
          .app-sidebar.mobile-show {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
