import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Landmark, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function RazorpayModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount = 19, 
  title = "Emergency Contact Unlock Pass",
  description = "One-time platform entitlement for verified provider contact"
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [upiApp, setUpiApp] = useState('gpay');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const paymentId = `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      setTimeout(() => {
        onSuccess({
          paymentId,
          amount,
          method: selectedMethod,
          timestamp: new Date().toISOString()
        });
        setIsSuccess(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div style={{
        background: '#ffffff',
        color: '#0f172a',
        width: '100%',
        maxWidth: '460px',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        position: 'relative'
      }}>
        {/* Razorpay Brand Header */}
        <div style={{
          background: '#0c2340',
          padding: '16px 20px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#3395ff',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              color: '#ffffff'
            }}>
              R
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                EV Sahayak Technologies
              </div>
              <div style={{ fontSize: '0.72rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} />
                <span>Razorpay Trusted Merchant • Test Mode</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Order Summary Ribbon */}
        <div style={{
          background: '#f8fafc',
          padding: '12px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
              {title}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              {description}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0c2340' }}>
              ₹{amount}.00
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '6px' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Razorpay transaction verified. Unlocking your requested entitlement...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', minHeight: '260px' }}>
            {/* Sidebar Methods */}
            <div style={{
              width: '140px',
              background: '#f1f5f9',
              borderRight: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button
                onClick={() => setSelectedMethod('upi')}
                style={{
                  padding: '12px 14px',
                  background: selectedMethod === 'upi' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderLeft: selectedMethod === 'upi' ? '3px solid #3395ff' : '3px solid transparent',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: selectedMethod === 'upi' ? 700 : 500,
                  color: selectedMethod === 'upi' ? '#0c2340' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <QrCode size={16} color={selectedMethod === 'upi' ? '#3395ff' : '#64748b'} />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setSelectedMethod('card')}
                style={{
                  padding: '12px 14px',
                  background: selectedMethod === 'card' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderLeft: selectedMethod === 'card' ? '3px solid #3395ff' : '3px solid transparent',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: selectedMethod === 'card' ? 700 : 500,
                  color: selectedMethod === 'card' ? '#0c2340' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={16} color={selectedMethod === 'card' ? '#3395ff' : '#64748b'} />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setSelectedMethod('netbanking')}
                style={{
                  padding: '12px 14px',
                  background: selectedMethod === 'netbanking' ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderLeft: selectedMethod === 'netbanking' ? '3px solid #3395ff' : '3px solid transparent',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: selectedMethod === 'netbanking' ? 700 : 500,
                  color: selectedMethod === 'netbanking' ? '#0c2340' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Landmark size={16} color={selectedMethod === 'netbanking' ? '#3395ff' : '#64748b'} />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Method Details Pane */}
            <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {selectedMethod === 'upi' && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                    Select Fast UPI Option:
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵' },
                      { id: 'cred', name: 'CRED UPI', icon: '⚫' }
                    ].map(app => (
                      <div
                        key={app.id}
                        onClick={() => setUpiApp(app.id)}
                        style={{
                          border: upiApp === app.id ? '2px solid #3395ff' : '1px solid #cbd5e1',
                          background: upiApp === app.id ? '#eff6ff' : '#ffffff',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{app.icon}</span>
                        <span>{app.name}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    ⚡ Instant authorization via Razorpay UPI intent.
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Card Number</div>
                  <input
                    type="text"
                    readOnly
                    value="4111 •••• •••• 1111 (Demo Card)"
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      background: '#f8fafc',
                      color: '#0f172a'
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value="12/28"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc', color: '#0f172a' }}
                    />
                    <input
                      type="text"
                      readOnly
                      value="CVV: 849"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#f8fafc', color: '#0f172a' }}
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Popular Banks:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((b, i) => (
                      <div key={i} style={{ border: '1px solid #cbd5e1', padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                style={{
                  background: '#3395ff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  boxShadow: '0 4px 12px rgba(51, 149, 255, 0.4)'
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authorizing with Bank...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount}.00</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Razorpay Footer */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          <span>Secured by Razorpay • 256-bit SSL</span>
          <span>PCI-DSS Compliant</span>
        </div>
      </div>
    </div>
  );
}
