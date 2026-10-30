import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function InteractiveMap({ stations = [], helpers = [], selectedItem = null, onItemSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Centered around Bengaluru
    const defaultCenter = [12.9716, 77.5946];

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true
      });

      // CartoDB Dark Matter / Voyager OpenStreetMap tiles for slick dark theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add Charging Station Markers
    stations.forEach(s => {
      if (!s.location?.coordinates) return;
      const [lng, lat] = s.location.coordinates;

      const isAther = s.operator.toLowerCase().includes('ather');
      const isTata = s.operator.toLowerCase().includes('tata');
      const isSwap = s.operator.toLowerCase().includes('bounce') || s.operator.toLowerCase().includes('sun');

      let iconColor = '#10b981'; // Green
      let label = '⚡';
      if (isSwap) {
        iconColor = '#06b6d4'; // Cyan
        label = '🔄';
      } else if (isAther) {
        iconColor = '#3b82f6';
      }

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background: ${iconColor};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">${label}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px;">
          <b style="font-size: 14px; color: #0f172a;">${s.name}</b>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${s.operator}</div>
          <div style="font-size: 12px; margin-top: 6px;">
            <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${s.verificationStatus}</span>
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onItemSelect) onItemSelect({ type: 'station', data: s });
      });

      markersRef.current.push(marker);
    });

    // Add Helper Markers (cyan/purple pulse)
    helpers.forEach(h => {
      if (!h.location?.coordinates) return;
      const [lng, lat] = h.location.coordinates;
      const hasBattery = h.services?.some(s => s.serviceType === 'BATTERY_SWAP');
      const hasCharger = h.services?.some(s => s.serviceType === 'PORTABLE_CHARGER');

      const helperIcon = L.divIcon({
        className: 'custom-helper-icon',
        html: `
          <div style="
            background: linear-gradient(135deg, #f43f5e, #a855f7);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 2px solid #ffffff;
            box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
            cursor: pointer;
            animation: bounce 1.5s infinite;
          ">🛵</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon: helperIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px;">
          <b style="font-size: 14px; color: #0f172a;">${h.displayName}</b>
          <div style="font-size: 11px; color: #10b981; font-weight: bold;">AVAILABLE NOW</div>
          <div style="font-size: 12px; margin-top: 4px;">
            ${hasBattery ? '🔋 Battery Swap Available' : ''}
            ${hasCharger ? '<br/>🔌 Portable Fast Charger' : ''}
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onItemSelect) onItemSelect({ type: 'helper', data: h });
      });

      markersRef.current.push(marker);
    });

    // Pan to selected item if any
    if (selectedItem?.location?.coordinates) {
      const [lng, lat] = selectedItem.location.coordinates;
      map.setView([lat, lng], 14, { animate: true });
    }

  }, [stations, helpers, selectedItem]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
      {/* Legend Badge */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '8px 12px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>Charging Station (Free Search)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }}></span>
          <span>Battery Swap Station</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }}></span>
          <span>EV Sahayak Helper (Battery / Charger)</span>
        </div>
      </div>
    </div>
  );
}
