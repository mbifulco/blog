import dynamic from 'next/dynamic';

export { default as YouTube } from './YouTube';
export const Vimeo = dynamic(() => import('./Vimeo'), { ssr: false });
