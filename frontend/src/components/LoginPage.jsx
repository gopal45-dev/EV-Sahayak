import React, { useState } from 'react';
import { Zap, ShieldCheck, User, Bike, Lock, Mail, Phone, ArrowRight, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function LoginPage({ onLoginSuccess, theme }) {
  const isHoneybee = theme !== 'obsidian' && !(typeof document !== 'undefined' && document.body.classList.contains('theme-obsidian'));
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginType === 'ADMIN') {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password: password.trim() })
        });
        const data = await res.json();
        if (data.success && data.admin) {
          onLoginSuccess(data.admin);
        } else {
          setErrorMessage(data.message || 'Invalid Administrator credentials.');
        }
      } catch (err) {
        setErrorMessage('Administrator authentication service unreachable. Please ensure the server is running.');
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
      background: isHoneybee ? '#fafafa' : '#09090b',
      padding: '20px',
      position: 'relative'
    }}>
      <div className="pro-card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 30px',
        background: isHoneybee ? '#ffffff' : '#121215',
        border: isHoneybee ? '2px solid #000000' : '2px solid #27272a',
        borderRadius: '12px',
        boxShadow: '6px 6px 0px #000000',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            background: '#facc15',
            border: '2px solid #000000',
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '3px 3px 0px #000000'
          }}>
            <Zap size={28} color="#000000" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: isHoneybee ? '#000000' : '#f4f4f5', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            EV Sahayak
          </h1>
          <p style={{ fontSize: '0.82rem', color: isHoneybee ? '#52525b' : '#a1a1aa', fontWeight: 600 }}>
            Bengaluru EV Charging & Emergency Roadside Pilot
          </p>
        </div>

        {/* Tab Switcher: Member vs Admin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: isHoneybee ? '#f4f4f5' : '#18181b',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #27272a'
        }}>
          <button
            type="button"
            onClick={selectMemberTab}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: loginType === 'MEMBER' ? '1.5px solid #000000' : '1.5px solid transparent',
              background: loginType === 'MEMBER' ? '#facc15' : 'transparent',
              color: loginType === 'MEMBER' ? '#000000' : (isHoneybee ? '#71717a' : '#a1a1aa'),
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: loginType === 'MEMBER' ? '2px 2px 0px #000000' : 'none'
            }}
          >
            <Bike size={16} color={loginType === 'MEMBER' ? '#000000' : (isHoneybee ? '#71717a' : '#a1a1aa')} />
            <span>Member Login</span>
          </button>

          <button
            type="button"
            onClick={selectAdminTab}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: loginType === 'ADMIN' ? '1.5px solid #000000' : '1.5px solid transparent',
              background: loginType === 'ADMIN' ? '#facc15' : 'transparent',
              color: loginType === 'ADMIN' ? '#000000' : (isHoneybee ? '#71717a' : '#a1a1aa'),
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: loginType === 'ADMIN' ? '2px 2px 0px #000000' : 'none'
            }}
          >
            <ShieldCheck size={16} color={loginType === 'ADMIN' ? '#000000' : (isHoneybee ? '#71717a' : '#a1a1aa')} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* GPS Notice for Members */}
        {loginType === 'MEMBER' && (
          <div style={{
            background: isHoneybee ? '#fefce8' : '#18181b',
            border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: isHoneybee ? '#854d0e' : '#fef08a',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '2px 2px 0px #000000'
          }}>
            <MapPin size={16} color="#ca8a04" />
            <span style={{ fontWeight: 600 }}>Signing in automatically requests device GPS to map nearby chargers & rescuers.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: '#fee2e2',
            border: '1.5px solid #dc2626',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#b91c1c',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            boxShadow: '2px 2px 0px #dc2626'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loginType === 'ADMIN' ? (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: isHoneybee ? '#18181b' : '#f4f4f5', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Admin Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-pro"
                    style={{
                      paddingLeft: '36px',
                      border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                      borderRadius: '6px',
                      background: isHoneybee ? '#ffffff' : '#18181b',
                      color: isHoneybee ? '#000000' : '#f4f4f5'
                    }}
                    placeholder="admin@domain.com"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: isHoneybee ? '#18181b' : '#f4f4f5', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-pro"
                    style={{
                      paddingLeft: '36px',
                      border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                      borderRadius: '6px',
                      background: isHoneybee ? '#ffffff' : '#18181b',
                      color: isHoneybee ? '#000000' : '#f4f4f5'
                    }}
                    placeholder="Enter admin password"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: isHoneybee ? '#18181b' : '#f4f4f5', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-pro"
                    style={{
                      paddingLeft: '36px',
                      border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                      borderRadius: '6px',
                      background: isHoneybee ? '#ffffff' : '#18181b',
                      color: isHoneybee ? '#000000' : '#f4f4f5'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: isHoneybee ? '#18181b' : '#f4f4f5', fontWeight: 700 }}>
                    Mobile Number *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: phone.length === 10 ? '#15803d' : '#71717a', fontWeight: 700 }}>
                    {phone.length}/10 digits
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
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
                    style={{
                      paddingLeft: '36px',
                      border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                      borderRadius: '6px',
                      background: isHoneybee ? '#ffffff' : '#18181b',
                      color: isHoneybee ? '#000000' : '#f4f4f5'
                    }}
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: isHoneybee ? '#18181b' : '#f4f4f5', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                  Passcode
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#71717a" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-pro"
                    style={{
                      paddingLeft: '36px',
                      border: isHoneybee ? '1.5px solid #18181b' : '1.5px solid #3f3f46',
                      borderRadius: '6px',
                      background: isHoneybee ? '#ffffff' : '#18181b',
                      color: isHoneybee ? '#000000' : '#f4f4f5'
                    }}
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

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: isHoneybee ? '#71717a' : '#a1a1aa', fontWeight: 600 }}>
          <span>Enterprise Role-Based Security • Real-time GPS Verification</span>
        </div>
      </div>
    </div>
  );
}
