import type { HTMLAttributes } from 'react';

import clsxm from '@utils/clsxm';

// Define the types of headings allowed
type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  // Add any additional props here
  as?: HeadingType;
};

export const Heading: React.FC<HeadingProps> = ({
  as,
  children,
  className,
  ...props
}) => {
  // Use the 'as' prop to dynamically determine the component type
  const Component = as ?? 'h2';

  const headingClassMap: Record<HeadingType, string> = {
    h1: 'text-2xl md:text-4xl uppercase',
    h2: 'text-xl md:text-2xl',
    h3: 'text-lg md:text-xl',
    h4: 'text-base md:text-lg',
    h5: 'text-sm uppercase tracking-widest',
    h6: 'text-xs uppercase tracking-widest text-gray-700',
  };
  const headingClasses = headingClassMap[Component] ?? 'text-4xl';

  return (
    <Component
      {...props}
      className={clsxm(
        'font-futura font-bold text-pink-600',
        'text-balance', // oh yes, my babies 🧘
        headingClasses,
        className
      )}
    >
      {children}
    </Component>
  );
};
