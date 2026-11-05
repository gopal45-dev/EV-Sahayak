import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import AdminWorkspace from './components/AdminWorkspace';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import UserDashboard from './components/UserDashboard';
import StationFinder from './components/StationFinder';
import EmergencyAssistance from './components/EmergencyAssistance';
import HelperPortal from './components/HelperPortal';
import ProfilePage from './components/ProfilePage';
import CommandPalette from './components/CommandPalette';
import ThreeBackground from './components/ThreeBackground';
import { initialStations } from '../../backend/src/seed/mockDatabase.js';

const SESSION_STORAGE_KEY = 'ev_sahayak_user_session';
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
const TAB_STORAGE_KEY = 'ev_sahayak_active_tab';
const VEHICLES_STORAGE_KEY = 'ev_sahayak_user_vehicles';
const THEME_STORAGE_KEY = 'ev_sahayak_theme';
const LANGUAGE_STORAGE_KEY = 'ev_sahayak_language';

const VALID_TABS = ['dashboard', 'emergency', 'charging', 'helper', 'profile', 'admin'];

const getStoredLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'kn' || saved === 'hi') return saved;
  } catch (e) {}
  return 'en';
};

const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'honeybee' || saved === 'obsidian' || saved === 'royal') return saved;
  } catch (e) {}
  return 'honeybee'; // Default to user requested theme: Honeybee Yellow, White, and Black margin lines!
};

// Retrieve session from localStorage; valid for 7 days
const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.user || !session.expiresAt) return null;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TAB_STORAGE_KEY);
      return null;
    }
    return session.user;
  } catch (err) {
    console.warn('Error reading stored session:', err);
    return null;
  }
};

const getStoredTab = (user) => {
  if (user?.role === 'ADMIN') return 'admin';
  try {
    const hash = window.location.hash.replace('#', '');
    if (VALID_TABS.includes(hash)) return hash;
    const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
    if (savedTab && VALID_TABS.includes(savedTab)) {
      return savedTab;
    }
  } catch (e) {}
  return 'dashboard';
};

const getStoredVehicles = () => {
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
};

export default function App() {
  // Theme state: 'royal' (Honeybee Yellow, White & Black) vs 'obsidian' (Dark)
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [language, setLanguage] = useState(() => getStoredLanguage());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {}
  };

  // Sync theme class to document body
  useEffect(() => {
    document.body.className = theme === 'obsidian' ? 'theme-obsidian' : 'theme-honeybee';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'obsidian' ? 'honeybee' : 'obsidian');
  };

  // Session stays logged in across refresh for at least 7 days unless logged out
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [activeTab, setActiveTab] = useState(() => {
    const user = getStoredSession();
    return getStoredTab(user);
  });
  const [stations, setStations] = useState(initialStations);
  const [helpers, setHelpers] = useState([]);
  const [vehicles, setVehicles] = useState(() => getStoredVehicles());
  const [backendConnected, setBackendConnected] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [stRes, provRes, vehRes] = await Promise.allSettled([
          fetch('http://localhost:5000/api/stations').then(r => r.json()),
          fetch('http://localhost:5000/api/providers').then(r => r.json()),
          fetch('http://localhost:5000/api/vehicles').then(r => r.json())
        ]);

        if (stRes.status === 'fulfilled' && stRes.value?.stations) {
          setStations(stRes.value.stations);
          setBackendConnected(true);
        }
        if (provRes.status === 'fulfilled' && provRes.value?.providers) {
          setHelpers(provRes.value.providers);
        }
        if (vehRes.status === 'fulfilled' && Array.isArray(vehRes.value?.vehicles)) {
          if (vehRes.value.vehicles.length > 0) {
            setVehicles(vehRes.value.vehicles);
            try {
              localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehRes.value.vehicles));
            } catch (e) {}
          } else {
            const localVehicles = getStoredVehicles();
            if (localVehicles.length > 0) {
              setVehicles(localVehicles);
            }
          }
        }
      } catch (err) {
        console.info('Backend sync fallback to memory:', err);
      }
    };

    fetchBackendData();
  }, []);

  // Synchronize browser history and mouse back/forward button navigation
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (VALID_TABS.includes(hash)) {
      setActiveTab(hash);
    } else if (activeTab) {
      window.history.replaceState({ tab: activeTab }, '', `#${activeTab}`);
    }

    const onPopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
        try { localStorage.setItem(TAB_STORAGE_KEY, event.state.tab); } catch (e) {}
      } else {
        const currentHash = window.location.hash.replace('#', '');
        if (VALID_TABS.includes(currentHash)) {
          setActiveTab(currentHash);
          try { localStorage.setItem(TAB_STORAGE_KEY, currentHash); } catch (e) {}
        }
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleTabChange = (tabId, pushHistory = true) => {
    // If routing to garage, redirect to profile where EV garage is housed
    const targetTab = tabId === 'garage' ? 'profile' : tabId;
    setActiveTab(targetTab);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, targetTab);
      if (pushHistory) {
        window.history.pushState({ tab: targetTab }, '', `#${targetTab}`);
      }
    } catch (e) {}
  };

  // Handlers
  const handleLoginSuccess = (user) => {
    const expiresAt = Date.now() + SESSION_EXPIRY_MS; // 7 days session
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user, expiresAt }));
    } catch (err) {
      console.warn('Failed to persist session to localStorage:', err);
    }
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      handleTabChange('admin');
    } else {
      handleTabChange('dashboard');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(TAB_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear session from localStorage:', err);
    }
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleReportStation = async (stationId, issueType, notes) => {
    try {
      await fetch(`http://localhost:5000/api/stations/${stationId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType, notes, reportedBy: currentUser?.name || 'Rider' })
      });
    } catch (err) {
      console.warn('API report fallback');
    }
    setStations(prev => prev.map(s => s.id === stationId ? { ...s, reportsCount: (s.reportsCount || 0) + 1 } : s));
  };

  const handleSuggestStation = async (stationData) => {
    try {
      const res = await fetch('http://localhost:5000/api/stations/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stationData)
      });
      const data = await res.json();
      if (data.station) {
        setStations(prev => [data.station, ...prev]);
        return;
      }
    } catch (err) {
      console.warn('API suggest fallback');
    }

    const fallbackStation = {
      id: `st_user_${Date.now()}`,
      name: stationData.name,
      operator: stationData.operator,
      address: stationData.address,
      city: 'Bengaluru',
      location: { type: 'Point', coordinates: [77.5946, 12.9716] },
      connectors: [{ connectorType: stationData.connectorTypes[0] || '15A_AC_3PIN', powerKw: 3.3, portsTotal: 1, portsAvailable: 1 }],
      verificationStatus: 'PENDING',
      lastVerifiedAt: new Date().toISOString(),
      source: 'COMMUNITY_SUBMISSION'
    };
    setStations(prev => [fallbackStation, ...prev]);
  };

  const handleRegisterHelper = async (helperData) => {
    try {
      const res = await fetch('http://localhost:5000/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helperData)
      });
      const data = await res.json();
      if (data.provider) {
        setHelpers(prev => [data.provider, ...prev]);
        return;
      }
    } catch (err) {
      console.warn('API provider fallback');
    }

    const newHelper = {
      id: `prov_${Date.now()}`,
      displayName: helperData.displayName,
      phone: helperData.phone,
      ownerId: helperData.ownerId,
      maskedPhone: helperData.phone.slice(0, 6) + ' XXXXX',
      areaName: helperData.areaName,
      location: { type: 'Point', coordinates: [77.6300, 12.9600] },
      serviceRadiusKm: helperData.serviceRadiusKm,
      availabilityStatus: 'AVAILABLE',
      verificationLevel: 'EQUIPMENT_AUDITED',
      approvalStatus: 'APPROVED',
      rating: 5.0,
      completedRescues: 0,
      services: helperData.services
    };
    setHelpers(prev => [newHelper, ...prev]);
  };

  const handleToggleHelperStatus = (providerId) => {
    setHelpers(prev => prev.map(h => {
      if (h.id === providerId) {
        const nextStatus = h.availabilityStatus === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
        return { ...h, availabilityStatus: nextStatus };
      }
      return h;
    }));
  };

  const handleAddVehicle = async (newVeh) => {
    let savedVeh = null;
    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVeh)
      });
      const data = await res.json();
      if (data.success && data.vehicle) {
        savedVeh = data.vehicle;
      }
    } catch (err) {
      console.warn('API vehicle fallback:', err);
    }
    const nextVeh = savedVeh || { ...newVeh, id: `veh_${Date.now()}` };
    setVehicles(prev => {
      const updated = [...prev, nextVeh];
      try {
        localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveVehicle = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/vehicles/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API vehicle delete fallback:', err);
    }
    setVehicles(prev => {
      const updated = prev.filter(v => v.id !== id);
      try {
        localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 1. Initial State: If not logged in, render the Login Page first
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} theme={theme} />;
  }

  // 2. Admin Role: If admin logged in (guptagopaldilipd@gmail.com), render dedicated Admin Workspace
  if (currentUser.role === 'ADMIN' && activeTab === 'admin') {
    return (
      <AdminWorkspace
        adminUser={currentUser}
        onLogout={handleLogout}
        stations={stations}
        helpers={helpers}
        onSwitchToRider={() => handleTabChange('dashboard')}
        theme={theme}
      />
    );
  }

  // 3. Member Role: Render Responsive Left Sidebar Layout with Three.js 3D Background
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-canvas)', position: 'relative' }}>
      {/* Ambient 3D Three.js Particles & Grid Background */}
      <ThreeBackground theme={theme} />

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        language={language}
      />

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>
        {/* Top Navbar with Search (Icon Only), Language, Notifications, Theme & Account Logo */}
        <TopNavbar
          currentUser={currentUser}
          activeTab={activeTab}
          onNavigate={handleTabChange}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenSearch={() => setIsSearchOpen(true)}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        <main style={{ flex: 1, paddingBottom: '60px' }}>
          {activeTab === 'dashboard' && (
            <UserDashboard
              currentUser={currentUser}
              vehicles={vehicles}
              stations={stations}
              helpers={helpers}
              onNavigate={handleTabChange}
              theme={theme}
              isTourOpen={isTourOpen}
              setIsTourOpen={setIsTourOpen}
              language={language}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyAssistance
              currentUser={currentUser}
              vehicles={vehicles}
              theme={theme}
              onNavigateToGarage={() => handleTabChange('profile')}
              onUnlockContact={(entitlement) => {
                console.log('Unlocked contact pass entitlement:', entitlement);
              }}
            />
          )}

          {activeTab === 'charging' && (
            <StationFinder
              stations={stations}
              theme={theme}
              onReportStation={handleReportStation}
              userVehicles={vehicles}
            />
          )}

          {activeTab === 'helper' && (
            <HelperPortal
              currentUser={currentUser}
              helpers={helpers}
              theme={theme}
              onRegisterHelper={handleRegisterHelper}
              onToggleStatus={handleToggleHelperStatus}
            />
          )}

          {/* Dedicated Profile & EV Garage View */}
          {(activeTab === 'profile' || activeTab === 'garage') && (
            <ProfilePage
              currentUser={currentUser}
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onRemoveVehicle={handleRemoveVehicle}
              onLogout={handleLogout}
              theme={theme}
              helpers={helpers}
            />
          )}
        </main>

        {/* Global Quick Action Search & Command Palette (Ctrl+K) */}
        <CommandPalette
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleTabChange}
          onToggleTheme={toggleTheme}
          theme={theme}
          onLogout={handleLogout}
          onLaunchTour={() => {
            handleTabChange('dashboard');
            setIsTourOpen(true);
          }}
        />

        {/* Footer */}
        <footer style={{
          borderTop: theme === 'obsidian' ? '1.5px solid #27272a' : '1.5px solid #18181b',
          background: theme === 'obsidian' ? '#121215' : '#ffffff',
          padding: '20px 24px',
          fontSize: '0.78rem',
          color: theme === 'obsidian' ? '#a1a1aa' : '#52525b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontWeight: 600 }}>
            EV Sahayak (ईवी सहायक) • Bengaluru Industrial EV Network
          </div>
          <div style={{ fontSize: '0.72rem', color: theme === 'obsidian' ? '#71717a' : '#71717a' }}>
            Logged in as {currentUser.name} • Theme: {theme === 'obsidian' ? 'Honeybee Obsidian' : 'Honeybee Yellow & Architectural White'}
          </div>
        </footer>
      </div>
    </div>
  );
}
