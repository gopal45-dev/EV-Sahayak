import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Zap, AlertCircle, MapPin, HeartHandshake, Bike, 
  Sun, Moon, HelpCircle, LogOut, Navigation, ArrowRight, CornerDownLeft, Shield, User, History, CreditCard 
} from 'lucide-react';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onToggleTheme, 
  theme, 
  onLogout,
  onLaunchTour 
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const allActions = [
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Go to Dashboard & Walkthrough',
      description: 'Central overview, live status, and app guide',
      icon: Zap,
      run: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'nav-emergency',
      category: 'SOS Roadside Rescue',
      title: 'Dispatch Emergency Rescue',
      description: 'Request mobile charger boost or 3-minute battery swap',
      icon: AlertCircle,
      highlight: true,
      run: () => { onNavigate('emergency'); onClose(); }
    },
    {
      id: 'nav-stations',
      category: 'Charging Discovery',
      title: 'Find Charging Stations in Bengaluru',
      description: '100% free search with Tata Power, BESCOM, Ather Grid filters',
      icon: MapPin,
      run: () => { onNavigate('charging'); onClose(); }
    },
    {
      id: 'nav-profile',
      category: 'Profile & Garage',
      title: 'Open My Profile & EV Garage',
      description: 'View user info, manage electric scooters, and check history',
      icon: User,
      run: () => { onNavigate('profile'); onClose(); }
    },
    {
      id: 'nav-history',
      category: 'History',
      title: 'View Rescue Requests & Helper History',
      description: 'Logs of roadside rescues received and helper payouts earned',
      icon: History,
      run: () => { onNavigate('profile'); onClose(); }
    },
    {
      id: 'nav-payments',
      category: 'Billing',
      title: 'View Razorpay Payment History',
      description: '₹19 contact unlock passes and ₹49 audit fee receipts',
      icon: CreditCard,
      run: () => { onNavigate('profile'); onClose(); }
    },
    {
      id: 'nav-helper',
      category: 'Community Earnings',
      title: 'Earn by Helping (Sahayak Portal)',
      description: 'Register for ₹49, toggle online status, earn rescue payouts',
      icon: HeartHandshake,
      run: () => { onNavigate('helper'); onClose(); }
    },
    {
      id: 'theme-toggle',
      category: 'Appearance',
      title: theme === 'royal' ? 'Switch to Obsidian Dark Theme' : 'Switch to Royal Theme (White, Red & Royal Blue)',
      description: 'Instant high-contrast theme toggle',
      icon: theme === 'royal' ? Moon : Sun,
      run: () => { onToggleTheme(); onClose(); }
    },
    {
      id: 'app-tour',
      category: 'Help & Guide',
      title: 'Start Interactive 5-Step App Tour',
      description: 'Learn all 4 features of EV Sahayak in 60 seconds',
      icon: HelpCircle,
      run: () => { onLaunchTour(); onClose(); }
    },
    {
      id: 'sign-out',
      category: 'Account',
      title: 'Sign Out of Account',
      description: 'Clear session credentials and return to login',
      icon: LogOut,
      danger: true,
      run: () => { onLogout(); onClose(); }
    }
  ];

  const filteredActions = allActions.filter(action => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      action.title.toLowerCase().includes(q) ||
      action.description.toLowerCase().includes(q) ||
      action.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (action) => {
    if (action && action.run) action.run();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        handleSelect(filteredActions[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  const isRoyal = theme === 'royal';

  return (
    <div 
      className="modal-overlay" 
      onClick={() => onClose()}
      style={{ zIndex: 9999, alignItems: 'flex-start', paddingTop: '10vh' }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: isRoyal ? '#ffffff' : '#0f172a',
          border: isRoyal ? '1px solid #cbd5e1' : '1px solid #1e293b',
          borderRadius: '16px',
          boxShadow: isRoyal ? '0 20px 45px rgba(0,0,0,0.15)' : '0 25px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
          background: isRoyal ? '#f8fafc' : '#090d16'
        }}>
          <Search size={20} color={isRoyal ? '#1d4ed8' : '#38bdf8'} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search any button or action (e.g., rescue, battery, garage, theme)..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleInputKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.98rem',
              color: isRoyal ? '#0f172a' : '#f8fafc',
              fontWeight: 500
            }}
          />
          <button
            onClick={() => onClose()}
            style={{
              background: 'transparent',
              border: 'none',
              color: isRoyal ? '#64748b' : '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ overflowY: 'auto', padding: '10px 12px', flex: 1 }}>
          {filteredActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: isRoyal ? '#64748b' : '#94a3b8' }}>
              <div style={{ marginBottom: '8px', fontSize: '1.4rem' }}>🔍</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: isRoyal ? '#0f172a' : '#ffffff' }}>No actions found for "{query}"</div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try searching "rescue", "garage", "stations", or "theme"</div>
            </div>
          ) : (
            filteredActions.map((action, index) => {
              const isSelected = selectedIndex === index;
              const IconComp = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected 
                      ? (isRoyal ? 'rgba(29, 78, 216, 0.08)' : '#1e293b') 
                      : 'transparent',
                    border: isSelected 
                      ? (isRoyal ? '1px solid rgba(29, 78, 216, 0.25)' : '1px solid #334155')
                      : '1px solid transparent',
                    transition: 'all 0.12s ease',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                    <div style={{
                      background: action.highlight 
                        ? (isRoyal ? 'rgba(220, 38, 38, 0.12)' : 'rgba(244, 63, 94, 0.15)')
                        : (isRoyal ? 'rgba(29, 78, 216, 0.1)' : 'rgba(59, 130, 246, 0.15)'),
                      color: action.highlight 
                        ? (isRoyal ? '#dc2626' : '#f43f5e') 
                        : (isRoyal ? '#1d4ed8' : '#60a5fa'),
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      flexShrink: 0
                    }}>
                      <IconComp size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          color: isRoyal ? '#0f172a' : '#ffffff'
                        }}>
                          {action.title}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: isRoyal ? '#e2e8f0' : '#1e293b',
                          color: isRoyal ? '#475569' : '#94a3b8'
                        }}>
                          {action.category}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: isRoyal ? '#64748b' : '#94a3b8',
                        marginTop: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {action.description}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    color: isRoyal ? '#1d4ed8' : '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: isSelected ? 1 : 0
                  }}>
                    <span>Jump</span>
                    <CornerDownLeft size={13} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{
          padding: '10px 18px',
          borderTop: isRoyal ? '1px solid #e2e8f0' : '1px solid #1e293b',
          background: isRoyal ? '#f8fafc' : '#090d16',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: isRoyal ? '#64748b' : '#94a3b8'
        }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div>
            Press <kbd style={{ background: isRoyal ? '#e2e8f0' : '#1e293b', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Ctrl+K</kbd> anywhere
          </div>
        </div>
      </div>
    </div>
  );
}

