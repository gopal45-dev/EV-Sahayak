import React, { useState } from 'react';
import { Bike, Plus, Trash2, BatteryCharging, Zap, CheckCircle2, Shield } from 'lucide-react';

export default function VehicleGarage({ vehicles = [], onAddVehicle, onRemoveVehicle }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [brand, setBrand] = useState('Ather');
  const [modelName, setModelName] = useState('450X Gen 3');
  const [variant, setVariant] = useState('Pro Pack');
  const [year, setYear] = useState(2024);
  const [connectorType, setConnectorType] = useState('ATHER_PROPRIETARY');
  const [hasSwappableBattery, setHasSwappableBattery] = useState(false);
  const [batteryPackModel, setBatteryPackModel] = useState('');
  const [regNumber, setRegNumber] = useState('');

  const popularModels = [
    { brand: 'Ather', model: '450X', connector: 'ATHER_PROPRIETARY', swappable: false },
    { brand: 'Ola', model: 'S1 Pro Gen 2', connector: '15A_AC_3PIN', swappable: false },
    { brand: 'TVS', model: 'iQube ST', connector: '15A_AC_3PIN', swappable: false },
    { brand: 'Hero Vida', model: 'V1 Pro', connector: '15A_AC_3PIN', swappable: true, pack: 'Hero Vida V1 Removable Pack' },
    { brand: 'Bounce', model: 'Infinity E1+', connector: 'SWAPPABLE_MODULAR', swappable: true, pack: 'Bounce Infinity E1 Dock' },
    { brand: 'Bajaj', model: 'Chetak Premium', connector: '15A_AC_3PIN', swappable: false },
    { brand: 'Ultraviolette', model: 'F77 Mach 2', connector: 'TYPE_2', swappable: false }
  ];

  const handleSelectQuick = (item) => {
    setBrand(item.brand);
    setModelName(item.model);
    setConnectorType(item.connector);
    setHasSwappableBattery(item.swappable);
    setBatteryPackModel(item.pack || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brand || !modelName) return;

    onAddVehicle({
      brand,
      modelName,
      variant,
      year: Number(year),
      batteryCapacityKwh: 3.8,
      connectorType,
      hasSwappableBattery,
      batteryPackModel: batteryPackModel || (hasSwappableBattery ? `${brand} Modular Battery` : 'Fixed Battery'),
      registrationNumber: regNumber
    });

    setShowAddModal(false);
    setRegNumber('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '4px' }}>
            My Electric Vehicle Garage
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Save your electric scooters to enable instant compatibility matching with chargers and Sahayak helpers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.9rem' }}
        >
          <Plus size={18} />
          <span>Add New EV</span>
        </button>
      </div>

      {/* Grid of Vehicles or Empty State */}
      {vehicles.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '30px auto',
          border: '1px dashed #334155'
        }}>
          <div style={{
            background: 'rgba(250, 204, 21, 0.15)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#ca8a04',
            border: '1.5px solid #18181b'
          }}>
            <Bike size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px' }}>
            Your Garage is Empty
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '24px' }}>
            No EV registered yet. Add your electric two-wheeler to enable on-demand roadside assistance (mobile charger delivery & compatible battery swaps).
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9rem', margin: '0 auto' }}
          >
            <Plus size={18} />
            <span>Add Your First EV</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {vehicles.map(v => (
            <div key={v.id} className="glass-panel" style={{ padding: '22px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#10b981'
                  }}>
                    <Bike size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                      {v.brand} {v.modelName}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {v.variant} • Year {v.year}
                    </div>
                  </div>
                </div>

                {v.isDefault && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={12} /> Primary
                  </span>
                )}
              </div>

              {/* Vehicle Specs */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Connector Type:</span>
                  <span style={{ fontWeight: 600, color: '#facc15' }}>{v.connectorType.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Battery Tech:</span>
                  <span style={{ fontWeight: 600, color: v.hasSwappableBattery ? '#eab308' : '#94a3b8' }}>
                    {v.hasSwappableBattery ? '🔋 Swappable Modular Pack' : '⚡ Fixed Battery'}
                  </span>
                </div>
                {v.hasSwappableBattery && v.batteryPackModel && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Pack Model:</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{v.batteryPackModel}</span>
                  </div>
                )}
                {v.registrationNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Reg Plate:</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{v.registrationNumber}</span>
                  </div>
                )}
              </div>

              {/* Bottom Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={12} /> Verified Profile
                </span>
                <button
                  onClick={() => onRemoveVehicle(v.id)}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.2)' }}
                  title="Remove vehicle"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
              Add Electric Vehicle
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
              Quickly select from popular Indian models or enter custom specifications.
            </p>

            {/* Quick Presets */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Popular Presets:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {popularModels.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectQuick(p)}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {p.brand} {p.model}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Connector / Socket *
                  </label>
                  <select
                    value={connectorType}
                    onChange={(e) => setConnectorType(e.target.value)}
                    className="input-field"
                  >
                    <option value="15A_AC_3PIN">15A AC Standard Socket</option>
                    <option value="ATHER_PROPRIETARY">Ather Dot / Fast Plug</option>
                    <option value="OLA_HYPER">Ola Hypercharger Plug</option>
                    <option value="SWAPPABLE_MODULAR">Modular Swappable Bay</option>
                    <option value="TYPE_2">Type 2 AC</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Reg Plate (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="KA-01-EV-1234"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Swappable Battery Check */}
              <div style={{
                background: hasSwappableBattery ? 'rgba(250, 204, 21, 0.12)' : 'rgba(255,255,255,0.02)',
                border: hasSwappableBattery ? '1.5px solid #18181b' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '12px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasSwappableBattery}
                    onChange={(e) => setHasSwappableBattery(e.target.checked)}
                    style={{ accentColor: '#facc15', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                    Vehicle features a removable / swappable battery pack
                  </span>
                </label>

                {hasSwappableBattery && (
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Battery Pack Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hero Vida V1 Pack or Bounce Infinity E1"
                      value={batteryPackModel}
                      onChange={(e) => setBatteryPackModel(e.target.value)}
                      className="input-field"
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
