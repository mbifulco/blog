import clsxm from '@utils/clsxm';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={clsxm(
      'inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;