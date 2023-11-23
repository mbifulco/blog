import clsxm from '@utils/clsxm';

type InputProps = {
  id: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  className,
  id,
  placeholder,
  required,
  type = 'text',
  ...props
}) => (
  <input
    className={clsxm(
      'block w-full rounded-lg border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm',
      className
    )}
    id={id}
    placeholder={placeholder}
    required={required}
    type={type}
    {...props}
  />
);

export default Input;
