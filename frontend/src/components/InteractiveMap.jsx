import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({ stations = [], helpers = [], selectedItem = null, onItemSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // 1. Initialize Map Instance Once on Mount & Cleanly Destroy on Unmount
  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent "Map container is already initialized"
    if (mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }

    const defaultCenter = [12.9716, 77.5946]; // Bengaluru Central

    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true,
      fadeAnimation: true
    });

    mapInstance.current = map;

    // OpenStreetMap high-availability tile layer (no key required, 100% reliable)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Invalidate size to guarantee tiles render at full container bounds
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Responsive resize observer
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // 2. Synchronize Stations, Helpers & Selection Markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add Charging Station Markers
    stations.forEach(s => {
      if (!s.location?.coordinates) return;
      const [lng, lat] = s.location.coordinates;

      const isAther = s.operator?.toLowerCase().includes('ather');
      const isTata = s.operator?.toLowerCase().includes('tata');
      const isSwap = s.operator?.toLowerCase().includes('bounce') || s.operator?.toLowerCase().includes('sun');

      let iconBg = '#10b981'; // Green for public verified chargers
      let label = '⚡';
      if (isSwap) {
        iconBg = '#eab308'; // Amber for battery swap
        label = '🔄';
      } else if (isAther) {
        iconBg = '#facc15'; // Honeybee Yellow for Ather Grid
      }

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background: ${iconBg};
            color: #000000;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 900;
            border: 2px solid #000000;
            box-shadow: 2px 2px 0px #000000;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">${label}</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 210px; color: #000000; padding: 2px;">
          <b style="font-size: 13px; display: block; margin-bottom: 2px;">${s.name}</b>
          <div style="font-size: 11px; color: #52525b; margin-bottom: 6px;">${s.operator} • ${s.city || 'Bengaluru'}</div>
          <div style="font-size: 11px; display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
            <span style="background: #fef08a; border: 1.5px solid #000000; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
              ${s.verificationStatus || 'VERIFIED'}
            </span>
            <span style="background: #f4f4f5; border: 1.5px solid #18181b; padding: 2px 6px; border-radius: 4px;">
              ${s.connectors?.[0]?.connectorType?.replace(/_/g, ' ') || '15A AC'}
            </span>
          </div>
          <a 
            href="${mapsUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              display: block;
              text-align: center;
              background: #facc15;
              color: #000000;
              text-decoration: none;
              font-weight: 800;
              font-size: 11px;
              padding: 6px 10px;
              border: 1.5px solid #000000;
              border-radius: 6px;
              box-shadow: 2px 2px 0px #000000;
            "
          >
            🧭 Open in Google Maps
          </a>
        </div>
      `);

      marker.on('click', () => {
        if (onItemSelect) onItemSelect({ type: 'station', data: s });
      });

      markersRef.current.push(marker);
    });

    // Add Helper Markers (if any online registered helpers)
    helpers.forEach(h => {
      if (!h.location?.coordinates) return;
      const [lng, lat] = h.location.coordinates;
      const hasBattery = h.services?.some(s => s.serviceType === 'BATTERY_SWAP');
      const hasCharger = h.services?.some(s => s.serviceType === 'PORTABLE_CHARGER');

      const helperIcon = L.divIcon({
        className: 'custom-helper-icon',
        html: `
          <div style="
            background: #facc15;
            color: #000000;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 2px solid #000000;
            box-shadow: 2px 2px 0px #000000;
            cursor: pointer;
            animation: bounce 1.5s infinite;
          ">🛵</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon: helperIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 180px; color: #000000;">
          <b style="font-size: 13px;">${h.displayName}</b>
          <div style="font-size: 11px; color: #15803d; font-weight: 700;">ONLINE HELPER</div>
          <div style="font-size: 11px; margin-top: 4px; color: #52525b;">
            ${hasBattery ? '🔋 Battery Swap Delivery' : ''}
            ${hasCharger ? '<br/>🔌 Mobile Fast Charger' : ''}
          </div>
        </div>
      `);

      marker.on('click', () => {
        if (onItemSelect) onItemSelect({ type: 'helper', data: h });
      });

      markersRef.current.push(marker);
    });

    // Pan to selected station or helper
    if (selectedItem?.location?.coordinates) {
      const [lng, lat] = selectedItem.location.coordinates;
      map.setView([lat, lng], 14, { animate: true });
    }

  }, [stations, helpers, selectedItem]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px', flex: 1, display: 'flex' }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '420px',
          borderRadius: '12px',
          border: '1.5px solid #18181b',
          zIndex: 1
        }} 
      />
      {/* Legend Badge */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '14px',
        zIndex: 1000,
        background: '#ffffff',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1.5px solid #000000',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '2px 2px 0px #000000'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '1px solid #000000' }}></span>
          <span>Public Verified Charger</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', border: '1px solid #000000' }}></span>
          <span>Battery Swap Station</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#facc15', border: '1px solid #000000' }}></span>
          <span>Ather Grid / Mobile Helper</span>
        </div>
      </div>
    </div>
  );
}
