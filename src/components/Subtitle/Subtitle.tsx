type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <span className="tagline font-sm inline-block rounded-md py-[-0.25ch] font-bold text-gray-700 uppercase">
      {children}
    </span>
  );
};

export default Subtitle;
