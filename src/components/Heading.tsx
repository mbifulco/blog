import clsx from 'clsx';

type HeadingProps<T extends React.ElementType> = {
  as: T;
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export const Heading = <T extends React.ElementType = 'h2'>({
  as,
  children,
  className,
  ...props
}: HeadingProps<T>) => {
  // Use the 'as' prop to dynamically determine the component type
  const Component = as || 'h2';

  let headingClasses = '';
  switch (Component) {
    case 'h1':
      headingClasses = 'text-5xl';
      break;
    case 'h2':
      headingClasses = 'text-4xl';
      break;
    case 'h3':
      headingClasses = 'text-3xl';
      break;
    case 'h4':
      headingClasses = 'text-2xl';
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
      className={clsx(
        'font-bold text-pink-600 hover:text-pink-700 active:text-pink-900',
        headingClasses,
        className
      )}
    >
      {children}
    </Component>
  );
};
