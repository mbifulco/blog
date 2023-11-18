type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <span className="tagline font-sm inline-block rounded-md bg-pink-400 px-2 py-[-0.25ch] uppercase text-white">
      {children}
    </span>
  );
};

export default Subtitle;
