import React, { useState } from 'react';
import { 
  Zap, MapPin, AlertCircle, HeartHandshake, 
  ChevronLeft, ChevronRight, Menu, X, 
  LayoutDashboard, Search 
} from 'lucide-react';
import { translations } from '../translations';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  theme = 'royal',
  onOpenSearch,
  language = 'en'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRoyal = theme === 'royal';
  const t = translations[language] || translations.en;

  // Navigation items: Account page is accessible ONLY via top-right account avatar
  const navItems = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'emergency', label: t.nav_emergency, icon: AlertCircle, highlight: true },
    { id: 'charging', label: t.nav_stations, icon: MapPin },
    { id: 'helper', label: t.nav_helper, icon: HeartHandshake }
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
              title="Quick Search"
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
        width: isCollapsed ? '76px' : '260px',
        minHeight: '100vh',
        background: isRoyal ? '#ffffff' : '#0b0f19',
        borderRight: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Top Header & Navigation */}
        <div>
          {/* Logo Section */}
          <div style={{
            padding: isCollapsed ? '16px 0' : '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b'
          }}>
            {!isCollapsed ? (
              <>
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
                      {t.bengaluru_pilot}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCollapsed(true)}
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
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  title={t.collapse}
                >
                  <ChevronLeft size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsCollapsed(false)}
                style={{
                  background: isRoyal ? '#1d4ed8' : '#2563eb',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: isRoyal ? '0 4px 14px rgba(29, 78, 216, 0.35)' : '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.15s ease'
                }}
                title={t.expand}
              >
                <Zap size={22} />
              </button>
            )}
          </div>

          {/* Quick Action Search Trigger */}
          <div style={{
            padding: isCollapsed ? '14px 0 8px' : '14px 16px 8px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            {isCollapsed ? (
              <button
                onClick={onOpenSearch}
                style={{
                  width: '46px',
                  height: '46px',
                  background: isRoyal ? '#f8fafc' : '#090d16',
                  border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
                  borderRadius: '12px',
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
            ) : (
              <button
                onClick={onOpenSearch}
                style={{
                  width: '100%',
                  background: isRoyal ? '#f8fafc' : '#090d16',
                  border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: isRoyal ? '#64748b' : '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={t.quick_search}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={15} color={isRoyal ? '#1d4ed8' : '#60a5fa'} />
                  <span>{t.quick_search}</span>
                </div>
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
              </button>
            )}
          </div>

          {/* Core Navigation Items */}
          <nav style={{
            padding: isCollapsed ? '8px 0' : '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: isCollapsed ? '8px' : '4px',
            alignItems: isCollapsed ? 'center' : 'stretch'
          }}>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              if (isCollapsed) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive 
                        ? (isRoyal ? '#1d4ed8' : '#2563eb') 
                        : (isRoyal ? 'transparent' : 'transparent'),
                      color: isActive 
                        ? '#ffffff' 
                        : (isRoyal ? (item.highlight ? '#dc2626' : '#475569') : (item.highlight ? '#f87171' : '#94a3b8')),
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isActive 
                        ? (isRoyal ? '0 4px 14px rgba(29, 78, 216, 0.4)' : '0 4px 14px rgba(37, 99, 235, 0.45)') 
                        : 'none',
                      transition: 'all 0.15s ease'
                    }}
                    title={item.label}
                  >
                    <Icon size={20} />
                    {item.highlight && !isActive && (
                      <span style={{
                        position: 'absolute',
                        right: '7px',
                        top: '7px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isRoyal ? '#dc2626' : '#f43f5e',
                        boxShadow: '0 0 6px #dc2626'
                      }} />
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
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
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span style={{
                      position: 'absolute',
                      right: '12px',
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

        {/* Bottom Expand / Collapse Toggle Bar */}
        <div style={{
          padding: isCollapsed ? '16px 0' : '16px 20px',
          borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'flex-end'
        }}>
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              style={{
                width: '42px',
                height: '36px',
                background: isRoyal ? '#f1f5f9' : '#1e293b',
                border: isRoyal ? '1px solid #cbd5e1' : '1px solid #334155',
                color: isRoyal ? '#1d4ed8' : '#38bdf8',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={t.expand}
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isRoyal ? '#64748b' : '#94a3b8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              <ChevronLeft size={15} />
              <span>{t.collapse}</span>
            </button>
          )}
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
