import { useState } from 'react';

import { Slider as LocalSlider } from '../Slider';

type OrtonEffectImageProps = {
  blurRadius?: number;
  opacity?: number;
  showControls?: boolean;
  src: string;
  alt?: string;
};
/* eslint-disable @next/next/no-img-element */
export const OrtonEffectImage: React.FC<OrtonEffectImageProps> = ({
  blurRadius: blurStart,
  opacity: opacityStart,
  showControls,
  src,
  alt = '',
}) => {
  const [opacity, setOpacity] = useState<number>(opacityStart ?? 50);
  const [blurRadius, setRedBlurRadius] = useState<number>(blurStart ?? 15);

  return (
    <div className="flex max-w-full flex-col gap-2">
      <div className="relative">
        <figure className="relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            style={{
              mixBlendMode: 'lighten',
              filter: `blur(${blurRadius}px)`,
              opacity: `${opacity}%`,
              position: 'absolute',
            }}
          />
          <img src={src} aria-hidden={true} />
        </figure>

        {showControls && (
          <div className="grid grid-cols-[12ch_1fr] items-center gap-2">
            <p className="inline-block text-right font-mono text-sm uppercase">
              Opacity:
            </p>
            <div className="center grow">
              <LocalSlider
                aria-label="Opacity Slider"
                onChange={([val]) => setOpacity(val)}
                minValue={5}
                maxValue={100}
                value={[opacity]}
                numberFormatter={
                  { format: (val) => `${val}%` } as Intl.NumberFormat
                }
                label={'%'}
              />
            </div>

            <p className="inline-block text-right font-mono text-sm uppercase">
              Blur Radius:
            </p>
            <div className="grow">
              <LocalSlider
                aria-label="Blur Radius Slider"
                onChange={([val]) => setRedBlurRadius(val)}
                minValue={5}
                maxValue={100}
                value={[blurRadius]}
                numberFormatter={
                  { format: (val) => `${val}px` } as Intl.NumberFormat
                }
                label={'px'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
