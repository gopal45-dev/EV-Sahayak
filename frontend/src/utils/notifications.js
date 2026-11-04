// Browser Web Notification Service for EV Sahayak
// Enables permission management and dispatch alerts for Emergency Roadside Rescue

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.warn('Web Notifications are not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

export const sendRescueAlertNotification = ({
  title,
  body,
  tag = 'ev-sahayak-alert',
  icon = '/vite.svg'
}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon,
      tag,
      badge: icon,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to display browser notification:', err);
    return false;
  }
};

// Dispatched when an EV rider submits an Emergency SOS Request
export const notifyHelperOfIncomingRescue = ({
  locationName = 'Indiranagar, Bengaluru',
  vehicleBrand = 'Ather',
  vehicleModel = '450X',
  serviceType = 'PORTABLE_CHARGER',
  payoutAmount = 249
}) => {
  const serviceLabel = serviceType === 'BATTERY_SWAP' ? 'Modular Battery Swap' : 'Mobile 3.3kW Charger';
  return sendRescueAlertNotification({
    title: '🚨 Emergency EV Rescue Nearby!',
    body: `New request: ${vehicleBrand} ${vehicleModel} stranded near ${locationName}. Service: ${serviceLabel}. Earn ₹${payoutAmount}.`,
    tag: 'sos-helper-dispatch'
  });
};

// Dispatched to the rider when a helper accepts and starts dispatch
export const notifyRiderOfHelperEnRoute = ({
  helperName = 'Ramesh Kumar',
  etaMinutes = 6,
  distanceKm = 1.8
}) => {
  return sendRescueAlertNotification({
    title: '⚡ Sahayak Rescuer En Route!',
    body: `${helperName} has accepted your rescue request and is moving towards your live GPS pin (~${etaMinutes} mins, ${distanceKm} km).`,
    tag: 'sos-rider-update'
  });
};

