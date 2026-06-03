import { useState, useEffect } from 'react';

export type DeviceState = 'desktop' | 'mobile-portrait' | 'mobile-landscape';

const MOBILE_BREAKPOINT = 768;
const LANDSCAPE_HEIGHT_THRESHOLD = 500;

function getDeviceState(): DeviceState {
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (w < MOBILE_BREAKPOINT) {
    return h > w ? 'mobile-portrait' : 'mobile-landscape';
  }

  if (w < 1024 && h < LANDSCAPE_HEIGHT_THRESHOLD) {
    return 'mobile-landscape';
  }

  return 'desktop';
}

export function useDeviceState(): DeviceState {
  const [device, setDevice] = useState<DeviceState>(getDeviceState);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceState());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return device;
}
