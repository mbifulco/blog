import React, {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  RefObject,
} from 'react';

export const GeneralObserver = ({ children, onEnter, height = 0 }) => {
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
    if (ref && ref.current) {
      observer.observe(ref.current);
    }
  }, [ref]);

  return (
    <div ref={ref} data-testid="general-observer" className="mdx-embed">
      {isChildVisible ? children : <div style={{ height, width: '100%' }} />}
    </div>
  );
};

export default GeneralObserver;
