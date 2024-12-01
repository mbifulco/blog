'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import {
  mergeProps,
  useFocusRing,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from 'react-aria';
import { useSliderState } from 'react-stately';
import type { SliderState, SliderStateOptions } from 'react-stately';

const Thumb = (props: {
  label?: string;
  index: number;
  state: SliderState;
  trackRef: React.RefObject<React.ElementRef<'div'>>;
  isFocusVisible: boolean;
  focusProps: ReturnType<typeof useFocusRing>['focusProps'];
  onChangeStart?: () => void;
}) => {
  const { state, trackRef, focusProps, isFocusVisible, index } = props;
  const inputRef = useRef<React.ElementRef<'input'>>(null);
  const { thumbProps, inputProps } = useSliderThumb(
    { index, trackRef, inputRef },
    state
  );

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2"
      style={{
        left: `${state.getThumbPercent(index) * 100}%`,
      }}
    >
      <div
        {...thumbProps}
        onMouseDown={(...args) => {
          thumbProps.onMouseDown?.(...args);
          props.onChangeStart?.();
        }}
        onPointerDown={(...args) => {
          thumbProps.onPointerDown?.(...args);
          props.onChangeStart?.();
        }}
        className={clsx(
          'h-4 rounded-full',
          isFocusVisible || state.isThumbDragging(index)
            ? 'w-1.5 bg-slate-900'
            : 'w-1 bg-slate-700'
        )}
      >
        <VisuallyHidden>
          <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
        </VisuallyHidden>
      </div>
    </div>
  );
};

export const Slider = (
  props: SliderStateOptions<number[]> & {
    onChangeStart?: () => void;
    label?: string;
  }
) => {
  const trackRef = useRef<React.ElementRef<'div'>>(null);
  const state = useSliderState(props);
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  );
  const { label } = props;
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...groupProps}
      className="relative inset-x-0 bottom-full top-0 flex flex-auto touch-none items-center gap-6"
    >
      {props.label && (
        <label className="sr-only" {...labelProps}>
          {props.label}
        </label>
      )}
      <div
        {...trackProps}
        onMouseDown={(...args) => {
          trackProps.onMouseDown?.(...args);
          props.onChangeStart?.();
        }}
        onPointerDown={(...args) => {
          trackProps.onPointerDown?.(...args);
          props.onChangeStart?.();
        }}
        ref={trackRef}
        className="relative w-full bg-slate-100 md:rounded-full"
      >
        <div
          className={clsx(
            'h-2 md:rounded-l-xl md:rounded-r-md',
            isFocusVisible || state.isThumbDragging(0)
              ? 'bg-pink-900'
              : 'bg-pink-700'
          )}
          style={{
            width:
              state.getThumbValue(0) === 0
                ? 0
                : `calc(${state.getThumbPercent(0) * 100}% - ${
                    isFocusVisible || state.isThumbDragging(0)
                      ? '0.3125rem'
                      : '0.25rem'
                  })`,
          }}
        />
        <Thumb
          index={0}
          state={state}
          trackRef={trackRef}
          onChangeStart={props.onChangeStart}
          focusProps={focusProps}
          isFocusVisible={isFocusVisible}
        />
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <output
          {...outputProps}
          aria-live="off"
          className={clsx(
            'hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 md:block',
            state.getThumbMaxValue(0) === 0 && 'opacity-0',
            isFocusVisible || state.isThumbDragging(0)
              ? 'bg-pink-100 text-slate-900'
              : 'text-slate-500'
          )}
        >
          {state.getThumbValue(0)}
        </output>
        <span className="text-sm leading-6 text-slate-300" aria-hidden="true">
          /
        </span>
        <span
          className={clsx(
            'hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 text-slate-500 md:block',
            state.getThumbMaxValue(0) === 0 && 'opacity-0'
          )}
        >
          {state.getThumbMaxValue(0)}
          {label}
        </span>
      </div>
    </div>
  );
};

export default Slider;
