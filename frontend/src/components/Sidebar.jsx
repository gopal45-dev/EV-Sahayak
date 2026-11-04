import React, { useState } from 'react';
import { 
  Zap, MapPin, AlertCircle, HeartHandshake, 
  ChevronLeft, ChevronRight, LogOut, Menu, X, 
  LayoutDashboard, Search 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  theme = 'royal',
  onOpenSearch 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRoyal = theme === 'royal';

  // Navigation items: Account page is accessible ONLY via top-right account avatar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Tour', icon: LayoutDashboard },
    { id: 'emergency', label: 'Emergency Rescue', icon: AlertCircle, highlight: true },
    { id: 'charging', label: 'Find Stations', icon: MapPin },
    { id: 'helper', label: 'Earn by Helping', icon: HeartHandshake }
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
        background: isRoyal ? '#ffffff' : '#0b0f19',
        borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
        zIndex: 90,
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: isRoyal ? '#1d4ed8' : '#2563eb',
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
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isRoyal ? '#0f172a' : '#fff' }}>EV Sahayak</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              style={{
                background: isRoyal ? '#f1f5f9' : '#1e293b',
                border: isRoyal ? '1px solid #cbd5e1' : '1px solid #334155',
                color: isRoyal ? '#1d4ed8' : '#38bdf8',
                padding: '7px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title="Quick Search (Ctrl+K)"
            >
              <Search size={18} />
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: isRoyal ? '#f1f5f9' : '#1e293b',
              border: isRoyal ? '1px solid #cbd5e1' : '1px solid #334155',
              color: isRoyal ? '#0f172a' : '#fff',
              padding: '7px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main Left Sidebar */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-show' : ''}`} style={{
        width: isCollapsed ? '78px' : '260px',
        minHeight: '100vh',
        background: isRoyal ? '#ffffff' : '#0b0f19',
        borderRight: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Top Header & Navigation */}
        <div>
          {/* Logo & Collapse Toggle */}
          <div style={{
            padding: isCollapsed ? '18px 12px' : '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b'
          }}>
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: isRoyal ? '#1d4ed8' : '#2563eb',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: isRoyal ? '0 4px 12px rgba(29, 78, 216, 0.25)' : '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}>
                  <Zap size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isRoyal ? '#0f172a' : '#ffffff', letterSpacing: '-0.02em' }}>
                    EV Sahayak
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isRoyal ? '#dc2626' : '#94a3b8', fontWeight: 600 }}>
                    Bengaluru Pilot
                  </div>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div style={{
                background: isRoyal ? '#1d4ed8' : '#2563eb',
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
                background: isRoyal ? '#f1f5f9' : '#1e293b',
                border: isRoyal ? '1px solid #cbd5e1' : '1px solid #334155',
                color: isRoyal ? '#475569' : '#94a3b8',
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

          {/* Quick Action Search Trigger Button */}
          <div style={{ padding: isCollapsed ? '14px 10px 8px' : '14px 16px 8px' }}>
            <button
              onClick={onOpenSearch}
              style={{
                width: '100%',
                background: isRoyal ? '#f8fafc' : '#090d16',
                border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
                borderRadius: '10px',
                padding: isCollapsed ? '8px 0' : '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                color: isRoyal ? '#64748b' : '#94a3b8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Search any action (Ctrl+K)"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={15} color={isRoyal ? '#1d4ed8' : '#60a5fa'} />
                {!isCollapsed && <span>Quick Search...</span>}
              </div>
              {!isCollapsed && (
                <kbd style={{
                  background: isRoyal ? '#e2e8f0' : '#1e293b',
                  fontSize: '0.68rem',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  color: isRoyal ? '#475569' : '#cbd5e1',
                  fontWeight: 600
                }}>
                  Ctrl+K
                </kbd>
              )}
            </button>
          </div>

          {/* Core Navigation Items */}
          <nav style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '11px 0' : '10px 14px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: '10px',
                    background: isActive 
                      ? (isRoyal ? '#1d4ed8' : '#2563eb') 
                      : 'transparent',
                    color: isActive 
                      ? '#ffffff' 
                      : (isRoyal ? (item.highlight ? '#dc2626' : '#475569') : (item.highlight ? '#f87171' : '#94a3b8')),
                    fontWeight: isActive ? 700 : (item.highlight ? 600 : 500),
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!isCollapsed && <span>{item.label}</span>}
                  {item.highlight && !isActive && (
                    <span style={{
                      position: 'absolute',
                      right: isCollapsed ? '6px' : '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isRoyal ? '#dc2626' : '#f43f5e'
                    }} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Sign Out Only */}
        <div style={{ padding: '16px', borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              background: isRoyal ? '#fff1f2' : '#0f172a',
              border: isRoyal ? '1px solid #fecdd3' : '1px solid #1e293b',
              borderRadius: '8px',
              padding: isCollapsed ? '10px 0' : '9px 12px',
              color: isRoyal ? '#dc2626' : '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'all 0.15s ease'
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
