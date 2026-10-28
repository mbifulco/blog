import clsxm from '@utils/clsxm';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={clsxm(
      'border-pink-fill bg-pink-fill text-on-fill hover:border-blue-fill hover:bg-blue-fill inline-flex items-center justify-center border-2 px-4 py-2 font-futura text-sm font-bold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-60',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
