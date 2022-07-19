import dynamic from 'next/dynamic';

export const CarbonAd = dynamic(() => import('./CarbonAd'), { ssr: false });
