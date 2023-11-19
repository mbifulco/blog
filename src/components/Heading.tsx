import clsxm from '@utils/clsxm';

// Define the types of headings allowed
type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = {
  as: HeadingType;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const Heading = ({
  as,
  children,
  className,
  ...props
}: HeadingProps) => {
  // Use the 'as' prop to dynamically determine the component type
  const Component = as || 'h2';

  let headingClasses = '';
  switch (Component) {
    case 'h1':
      headingClasses = 'text-6xl';
      break;
    case 'h2':
      headingClasses = 'text-5xl';
      break;
    case 'h3':
      headingClasses = 'text-4xl';
      break;
    case 'h4':
      headingClasses = 'text-3xl';
      break;
    case 'h5':
      headingClasses = 'text-xl';
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
        'font-futura font-bold uppercase text-pink-600',
        headingClasses,
        className
      )}
    >
      {children}
    </Component>
  );
};
