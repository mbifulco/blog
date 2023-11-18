type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <span className="py-[-0.25ch] px-2 rounded-md tagline font-sm uppercase text-white bg-pink-400 inline-block">
      {children}
    </span>
  );
};

export default Subtitle;
