import { useState } from 'react';
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Stack,
  Text,
} from '@chakra-ui/react';

/* eslint-disable @next/next/no-img-element */
export const OrtonEffectImage = ({
  blur: blurStart,
  opacity: opacityStart,
  showControls,
  src,
  alt = '',
}) => {
  const [opacity, setOpacity] = useState(opacityStart || 50);
  const [blurRadius, setRedBlurRadius] = useState(blurStart || 15);

  const labelStyles = {
    mt: '2',
    ml: '-2.5',
    fontSize: 'sm',
  };

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
        <img src={src} alt={alt} />
      </figure>

      {showControls && (
        <Stack spacing={2}>
          <Stack direction="row" pt={4} pb={2} mt={1}>
            <Text fontSize={'sm'}>Opacity {opacity}%</Text>
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setOpacity(val)}
              defaultValue={opacityStart}
            >
              <SliderMark
                value={opacity}
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-5"
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
            <Text fontSize={'sm'}>Blur Radius {blurRadius}px</Text>
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setRedBlurRadius(val)}
              min={5}
              max={100}
              defaultValue={blurStart}
            >
              <SliderMark
                value={blurRadius}
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-5"
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
