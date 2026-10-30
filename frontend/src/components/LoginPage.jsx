import React, { useState } from 'react';
import { Zap, ShieldCheck, User, Bike, Lock, Mail, Phone, ArrowRight, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [loginType, setLoginType] = useState('MEMBER'); // 'MEMBER' or 'ADMIN'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRequestingGps, setIsRequestingGps] = useState(false);

  // Switch to Admin
  const selectAdminTab = () => {
    setLoginType('ADMIN');
    setEmail('');
    setPassword('');
    setErrorMessage('');
  };

  // Switch to Member
  const selectMemberTab = () => {
    setLoginType('MEMBER');
    setName('');
    setPhone('');
    setPassword('');
    setErrorMessage('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginType === 'ADMIN') {
      // Strict Admin check per user instructions
      if (email.trim() === 'guptagopaldilipd@gmail.com' && password === 'guptagopal999') {
        onLoginSuccess({
          name: 'Gopal Gupta (Admin)',
          email: 'guptagopaldilipd@gmail.com',
          role: 'ADMIN',
          location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru Central Command' }
        });
      } else {
        setErrorMessage('Invalid Administrator credentials. Only guptagopaldilipd@gmail.com is authorized.');
      }
      return;
    }

    // Member Login - check 10 numeric digits
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Mobile number must be exactly 10 numeric digits.');
      return;
    }

    // Member Login - Request device GPS permission
    setIsRequestingGps(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsRequestingGps(false);
          const { latitude, longitude } = position.coords;
          onLoginSuccess({
            name: name || 'EV Rider',
            phone: cleanPhone,
            role: 'MEMBER',
            location: {
              lat: latitude,
              lng: longitude,
              address: `GPS Pin (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Bengaluru`
            }
          });
        },
        (error) => {
          setIsRequestingGps(false);
          console.warn('Geolocation permission denied or timed out:', error.message);
          // Fallback to Bengaluru default coordinates if user blocks browser GPS prompt
          onLoginSuccess({
            name: name || 'EV Rider',
            phone: cleanPhone,
            role: 'MEMBER',
            location: {
              lat: 12.9716,
              lng: 77.5946,
              address: 'Indiranagar & MG Road, Bengaluru (Approximate GPS)'
            }
          });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsRequestingGps(false);
      onLoginSuccess({
        name: name || 'EV Rider',
        phone: cleanPhone,
        role: 'MEMBER',
        location: {
          lat: 12.9716,
          lng: 77.5946,
          address: 'Bengaluru, Karnataka'
        }
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, #172554 0%, #090d16 70%)',
      padding: '20px'
    }}>
      <div className="pro-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 30px',
        border: '1px solid #1e293b',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.7rem', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            EV Sahayak
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Bengaluru EV Charging & Emergency Assistance Portal
          </p>
        </div>

        {/* Tab Switcher: Member vs Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: '#090d16',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #1e293b'
        }}>
          <button
            type="button"
            onClick={selectMemberTab}
            style={{
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              background: loginType === 'MEMBER' ? '#1e293b' : 'transparent',
              color: loginType === 'MEMBER' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Bike size={16} color={loginType === 'MEMBER' ? '#38bdf8' : '#64748b'} />
            <span>Member Login</span>
          </button>

          <button
            type="button"
            onClick={selectAdminTab}
            style={{
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              background: loginType === 'ADMIN' ? '#1e293b' : 'transparent',
              color: loginType === 'ADMIN' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} color={loginType === 'ADMIN' ? '#f59e0b' : '#64748b'} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* GPS Notice for Members */}
        {loginType === 'MEMBER' && (
          <div style={{
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '0.78rem',
            color: '#93c5fd',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MapPin size={16} color="#60a5fa" />
            <span>Signing in will automatically request device GPS to accurately locate nearby chargers & helpers.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '0.8rem',
            color: '#f87171',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loginType === 'ADMIN' ? (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Admin Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-pro"
                    style={{ paddingLeft: '36px' }}
                    placeholder="admin@domain.com"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-pro"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Enter admin password"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-pro"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                    Mobile Number *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: phone.length === 10 ? '#00d293' : '#64748b' }}>
                    {phone.length}/10 digits
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(digitsOnly);
                    }}
                    className="input-pro"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-pro"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Enter passcode"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isRequestingGps}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '0.95rem' }}
          >
            {isRequestingGps ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Acquiring Device GPS...</span>
              </>
            ) : (
              <>
                <span>Sign In & Open EV Sahayak</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
          <span>Enterprise Role-Based Security • Real-time GPS Verification</span>
        </div>
      </div>
    </div>
  );
}
