type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <span className="tagline font-sm inline-block rounded-md py-[-0.25ch] font-futura font-bold uppercase text-gray-700">
      {children}
    </span>
  );
};

export default Subtitle;
