import React, { useState } from 'react';
import { ShieldCheck, LogOut, Users, MapPin, DollarSign, Activity, FileText, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminWorkspace({ adminUser, onLogout, stations = [], helpers = [] }) {
  const [activeTab, setActiveTab] = useState('overview');

  const verifiedStationsCount = stations.filter(s => s.verificationStatus === 'VERIFIED').length;
  const pendingStationsCount = stations.filter(s => s.verificationStatus === 'PENDING').length;
  const activeHelpersCount = helpers.filter(h => h.availabilityStatus === 'AVAILABLE').length;

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Bar */}
      <header style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              EV Sahayak Admin Workspace
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
              Designated Superadmin: {adminUser?.email || 'guptagopaldilipd@gmail.com'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-clean badge-amber">ROOT PRIVILEGES</span>
          <button
            onClick={onLogout}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '32px 24px', flex: 1 }}>
        {/* Banner */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '14px',
          padding: '18px 24px',
          marginBottom: '28px'
        }}>
          <h2 style={{ fontSize: '1.25rem', color: '#fbbf24', marginBottom: '4px' }}>
            Separate Administrative Dashboard
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
            This separate workspace is strictly reserved for <b>guptagopaldilipd@gmail.com</b>. Custom administration, dispatch operations, and financial auditing modules will be integrated here as required.
          </p>
        </div>

        {/* Real-Time Platform Status Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="pro-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span>Verified Charging Locations</span>
              <MapPin size={18} color="#00d293" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              {verifiedStationsCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/ {stations.length}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: pendingStationsCount > 0 ? '#f59e0b' : '#00d293', marginTop: '4px' }}>
              {pendingStationsCount} pending approval
            </div>
          </div>

          <div className="pro-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span>Registered Sahayak Providers</span>
              <Users size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              {activeHelpersCount} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>Available</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Total Network: {helpers.length} verified helpers
            </div>
          </div>

          <div className="pro-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span>Razorpay Revenue Gateway</span>
              <DollarSign size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff' }}>
              Active
            </div>
            <div style={{ fontSize: '0.75rem', color: '#00d293', marginTop: '4px' }}>
              ₹19 Rescue Pass + ₹49 Helper Audit
            </div>
          </div>
        </div>

        {/* Operational Modules Card */}
        <div className="pro-card" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '6px' }}>
            Administrative Modules Queue
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '20px' }}>
            Ready for configuration per your specifications.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Activity size={18} color="#38bdf8" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>Live Breakdown Telemetry</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                Monitor active breakdown alerts and real-time provider dispatch across Bengaluru.
              </p>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileText size={18} color="#f59e0b" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>Provider Audit Verification</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                Approve or suspend helper equipment listings (portable charger output & battery certifications).
              </p>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={18} color="#00d293" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>Payment Dispute Resolution</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                Manage automatic refunds and credits for failed provider responses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
