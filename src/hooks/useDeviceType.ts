import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType(): { device: DeviceType; isMobile: boolean; isTablet: boolean; isDesktop: boolean } {
 const [device, setDevice] = useState<DeviceType>('desktop');

 useEffect(() => {
 const handleResize = () => {
 const width = window.innerWidth;
 if (width < 768) {
 setDevice('mobile');
 } else if (width >= 768 && width < 1024) {
 setDevice('tablet');
 } else {
 setDevice('desktop');
 }
 };

 // Initial check
 handleResize();

 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);

 return {
 device,
 isMobile: device === 'mobile',
 isTablet: device === 'tablet',
 isDesktop: device === 'desktop'
 };
}
