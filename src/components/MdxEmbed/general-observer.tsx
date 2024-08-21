import type { FunctionComponent, RefObject } from 'react';
import React, { useEffect, useRef, useState } from 'react';

type IGeneralObserverProps = {
  /** React Children */
  children: React.ReactNode;
  /** Fires when IntersectionObserver enters viewport */
  onEnter?: (id?: string) => void;
  /** The height of the placeholder div before the component renders in */
  height?: number;
};

export const GeneralObserver: FunctionComponent<IGeneralObserverProps> = ({
  children,
  onEnter,
  height = 0,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isChildVisible, setIsChildVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) {
          setIsChildVisible(true);
          if (onEnter) onEnter();
        }
      },
      {
        root: null,
        rootMargin: '400px',
        threshold: 0,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [ref, onEnter]);

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      data-testid="general-observer"
      className="mdx-embed"
    >
      {isChildVisible ? children : <div style={{ height, width: '100%' }} />}
    </div>
  );
};
