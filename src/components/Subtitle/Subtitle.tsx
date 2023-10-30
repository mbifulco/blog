type SubtitleProps = {
  children: React.ReactNode;
};

const Subtitle = ({ children }) => {
  return (
    <span className="py-[-0.25ch] px-[1.5ch] rounded-3xl tagline font-sm uppercase text-white bg-pink-400 inline-block">
      {children}
    </span>
  );
};

export default Subtitle;
