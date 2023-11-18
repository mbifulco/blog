/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Stack,
  Text,
} from '@chakra-ui/react';

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
    <Stack spacing={2}>
      <figure>
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
        <Stack spacing={2}>
          <Stack direction="row" pt={4} pb={2} mt={1}>
            <Text width="15%" fontSize={'sm'}>
              Opacity {opacity}%
            </Text>
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setOpacity(val)}
              defaultValue={opacityStart}
              width="80%"
            >
              <SliderMark
                value={opacity}
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-8"
                ml="-5"
                w="12"
              >
                {opacity}%
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Stack>

          <Stack direction="row" pb={2}>
            <Text width="15%" fontSize={'sm'}>
              Blur Radius {blurRadius}px
            </Text>
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setRedBlurRadius(val)}
              min={5}
              max={100}
              defaultValue={blurStart}
              width="80%"
            >
              <SliderMark
                value={blurRadius}
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-8"
                ml="-5"
                w="12"
              >
                {blurRadius}%
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
