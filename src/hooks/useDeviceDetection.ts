import { useState, useEffect } from 'react';

interface DeviceState {
  isLandscape: boolean;
  isMobile: boolean;
  isPortraitMobile: boolean;
}

export function useDeviceDetection(): DeviceState {
  const [state, setState] = useState<DeviceState>({
    isLandscape: true,
    isMobile: false,
    isPortraitMobile: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      
      setState({
        isLandscape,
        isMobile,
        isPortraitMobile: !isLandscape && isMobile,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return state;
}
