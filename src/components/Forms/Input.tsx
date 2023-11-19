type InputProps = {
  id: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  required,
  type = 'text',
  ...props
}) => (
  <input
    className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500 sm:text-sm"
    id={id}
    placeholder={placeholder}
    required={required}
    type={type}
    {...props}
  />
);

export default Input;
