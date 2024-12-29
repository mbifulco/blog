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

  let headingClasses = '';
  switch (Component) {
    case 'h1':
      headingClasses = 'text-2xl md:text-4xl uppercase italic';
      break;
    case 'h2':
      headingClasses = 'text-2xl md:text-3xl';
      break;
    case 'h3':
      headingClasses = 'text-xl md:text-2xl';
      break;
    case 'h4':
      headingClasses = 'text-xl';
      break;
    case 'h5':
      headingClasses = 'text-lg';
      break;
    case 'h6':
      headingClasses = 'text-lg';
      break;
    default:
      headingClasses = 'text-4xl';
      break;
  }

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
