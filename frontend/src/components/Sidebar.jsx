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
  theme = 'honeybee',
  onOpenSearch,
  language = 'en'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHoneybee = theme !== 'obsidian';
  const isRoyal = isHoneybee;
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
        background: isHoneybee ? '#ffffff' : '#0b0f19',
        borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
        zIndex: 90,
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#facc15',
            border: '1.5px solid #000000',
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <Zap size={18} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: isHoneybee ? '#000000' : '#fff' }}>EV Sahayak</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              style={{
                background: isHoneybee ? '#ffffff' : '#1e293b',
                border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155',
                color: isHoneybee ? '#000000' : '#f4f4f5',
                padding: '7px',
                borderRadius: '6px',
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
              background: isHoneybee ? '#ffffff' : '#1e293b',
              border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155',
              color: isHoneybee ? '#000000' : '#fff',
              padding: '7px',
              borderRadius: '6px',
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
        background: isHoneybee ? '#ffffff' : '#0b0f19',
        borderRight: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
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
            borderBottom: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b'
          }}>
            {!isCollapsed ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: '#facc15',
                    border: '1.5px solid #000000',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    boxShadow: '2px 2px 0px #000000'
                  }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isHoneybee ? '#000000' : '#ffffff', letterSpacing: '-0.02em' }}>
                      EV Sahayak
                    </div>
                    <div style={{ fontSize: '0.7rem', color: isHoneybee ? '#ca8a04' : '#94a3b8', fontWeight: 700 }}>
                      {t.bengaluru_pilot}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCollapsed(true)}
                  className="desktop-toggle-btn"
                  style={{
                    background: isHoneybee ? '#f4f4f5' : '#1e293b',
                    border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155',
                    color: isHoneybee ? '#18181b' : '#94a3b8',
                    borderRadius: '6px',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                  background: '#facc15',
                  border: '1.5px solid #000000',
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #000000'
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
                  width: '44px',
                  height: '44px',
                  background: isHoneybee ? '#ffffff' : '#090d16',
                  border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isHoneybee ? '#000000' : '#facc15',
                  cursor: 'pointer'
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
                  background: isHoneybee ? '#fafafa' : '#090d16',
                  border: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: isHoneybee ? '#71717a' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title={t.quick_search}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={15} color={isHoneybee ? '#000000' : '#facc15'} />
                  <span>{t.quick_search}</span>
                </div>
                <kbd style={{
                  background: isHoneybee ? '#fef08a' : '#1e293b',
                  border: isHoneybee ? '1px solid #000000' : 'none',
                  fontSize: '0.68rem',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  color: isHoneybee ? '#000000' : '#cbd5e1',
                  fontWeight: 700
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
            gap: isCollapsed ? '8px' : '6px',
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
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive 
                        ? '#facc15' 
                        : (isHoneybee ? '#ffffff' : 'transparent'),
                      color: isActive 
                        ? '#000000' 
                        : (isHoneybee ? (item.highlight ? '#dc2626' : '#18181b') : (item.highlight ? '#f87171' : '#94a3b8')),
                      border: isHoneybee ? (isActive ? '1.5px solid #000000' : '1.5px solid transparent') : 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isActive && isHoneybee ? '2px 2px 0px #000000' : 'none'
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
                        background: '#dc2626',
                        border: '1px solid #000000'
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
                    padding: '11px 16px',
                    borderRadius: '8px',
                    background: isActive 
                      ? '#facc15' 
                      : (isHoneybee ? '#ffffff' : 'transparent'),
                    color: isActive 
                      ? '#000000' 
                      : (isHoneybee ? (item.highlight ? '#dc2626' : '#18181b') : (item.highlight ? '#f87171' : '#94a3b8')),
                    fontWeight: isActive ? 800 : (item.highlight ? 700 : 600),
                    fontSize: '0.9rem',
                    border: isHoneybee 
                      ? (isActive ? '1.5px solid #000000' : '1.5px solid transparent') 
                      : 'none',
                    boxShadow: isActive && isHoneybee ? '2px 2px 0px #000000' : 'none',
                    cursor: 'pointer',
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
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#dc2626',
                      border: '1px solid #000000'
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
          borderTop: isHoneybee ? '1.5px solid #18181b' : '1px solid #1e293b',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'flex-end'
        }}>
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              style={{
                width: '42px',
                height: '36px',
                background: isHoneybee ? '#f4f4f5' : '#1e293b',
                border: isHoneybee ? '1.5px solid #18181b' : '1px solid #334155',
                color: isHoneybee ? '#000000' : '#facc15',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
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
                color: isHoneybee ? '#52525b' : '#94a3b8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 700
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
