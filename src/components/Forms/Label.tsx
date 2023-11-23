type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
};

const Label: React.FC<LabelProps> = ({ children, htmlFor }) => (
  <label
    className="block text-sm font-medium text-zinc-500 dark:text-zinc-400"
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

export default Label;
