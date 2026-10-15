type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return (
    <span className="tagline riso-kicker inline-block text-[0.8rem] tracking-[0.18em]">
      {children}
    </span>
  );
};

export default Subtitle;
