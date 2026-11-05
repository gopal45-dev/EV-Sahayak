import React, { useState } from 'react';
import { X, ShieldCheck, User, Bike, HeartHandshake, Lock, ArrowRight, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, currentUser }) {
  const [role, setRole] = useState('MEMBER'); // 'MEMBER', 'PROVIDER', 'ADMIN'
  const [phone, setPhone] = useState('+91 99014 43900');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Pooja Ramanathan');

  if (!isOpen) return null;

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setName('Govind Sharma (Operations Lead)');
      setPhone('admin@evsahayak.in');
    } else if (selectedRole === 'PROVIDER') {
      setName('Ramesh Kumar (QuickEV Assist)');
      setPhone('+91 98451 23890');
    } else {
      setName('Pooja Ramanathan');
      setPhone('+91 99014 43900');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name,
      phone,
      role
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="pro-card" style={{
        width: '100%',
        maxWidth: '440px',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Modal Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '2px' }}>
              Sign In to EV Sahayak
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Select your account role to access designated portal features.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '6px',
          background: '#090d16',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #1e293b'
        }}>
          <button
            type="button"
            onClick={() => handleRoleSelect('MEMBER')}
            style={{
              background: role === 'MEMBER' ? '#1e293b' : 'transparent',
              color: role === 'MEMBER' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Bike size={16} color={role === 'MEMBER' ? '#facc15' : '#64748b'} />
            <span>EV Member</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('PROVIDER')}
            style={{
              background: role === 'PROVIDER' ? '#1e293b' : 'transparent',
              color: role === 'PROVIDER' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <HeartHandshake size={16} color={role === 'PROVIDER' ? '#00d293' : '#64748b'} />
            <span>Helper</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            style={{
              background: role === 'ADMIN' ? '#1e293b' : 'transparent',
              color: role === 'ADMIN' ? '#ffffff' : '#94a3b8',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={16} color={role === 'ADMIN' ? '#f59e0b' : '#64748b'} />
            <span>Admin</span>
          </button>
        </div>

        {/* Role Information Banner */}
        <div style={{
          background: role === 'ADMIN' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(250, 204, 21, 0.1)',
          border: role === 'ADMIN' ? '1px solid rgba(245, 158, 11, 0.3)' : '1.5px solid rgba(250, 204, 21, 0.35)',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '0.78rem',
          color: role === 'ADMIN' ? '#fbbf24' : '#facc15',
          marginBottom: '18px',
          lineHeight: '1.4'
        }}>
          {role === 'ADMIN' && (
            <span>🔒 <b>Admin Access:</b> Full moderation privilege to approve stations, oversee revenue, and inspect community reports.</span>
          )}
          {role === 'PROVIDER' && (
            <span>🛠️ <b>Helper Access:</b> Provider portal access to manage emergency portable chargers, battery swap stocks, and earnings.</span>
          )}
          {role === 'MEMBER' && (
            <span>🛵 <b>EV Member Access:</b> Search free charging stations, manage your personal EV garage, and request low-battery rescue.</span>
          )}
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Full Name / Identifier
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-pro"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                {role === 'ADMIN' ? 'Admin Email' : 'Mobile Number'}
              </label>
              {role !== 'ADMIN' && (
                <span style={{ fontSize: '0.72rem', color: phone.length === 10 ? '#00d293' : '#64748b' }}>
                  {phone.length}/10 digits
                </span>
              )}
            </div>
            <input
              type={role === 'ADMIN' ? 'email' : 'tel'}
              required
              maxLength={role === 'ADMIN' ? undefined : 10}
              inputMode={role === 'ADMIN' ? undefined : 'numeric'}
              value={phone}
              onChange={(e) => {
                if (role === 'ADMIN') {
                  setPhone(e.target.value);
                } else {
                  const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(digitsOnly);
                }
              }}
              className="input-pro"
              placeholder={role === 'ADMIN' ? 'admin@domain.com' : 'Enter 10-digit mobile number'}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
              Password / Pin
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-pro"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '11px', marginTop: '6px' }}
          >
            <span>Sign In as {role === 'ADMIN' ? 'Administrator' : role === 'PROVIDER' ? 'Sahayak Helper' : 'Member'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
