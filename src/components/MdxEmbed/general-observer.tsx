import { useEffect, useRef, useState } from 'react';

type GeneralObserverProps = {
  children: React.ReactNode;
  onEnter?: () => void;
  height?: number;
};

export const GeneralObserver: React.FC<GeneralObserverProps> = ({
  children,
  onEnter,
  height = 0,
}) => {
  const ref = useRef(null);
  const [isChildVisible, setIsChildVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) {
          setIsChildVisible(true);
          onEnter && onEnter();
        }
      },
      {
        root: null,
        rootMargin: '400px',
        threshold: 0,
      }
    );
    if (ref?.current) {
      observer.observe(ref.current);
    }
  }, [ref, onEnter]);

  return (
    <div ref={ref} data-testid="general-observer" className="mdx-embed">
      {isChildVisible ? children : <div style={{ height, width: '100%' }} />}
    </div>
  );
};

export default GeneralObserver;
