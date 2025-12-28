const SoldOut = () => {
  return (
    <figure
      className="group absolute bottom-1/4 left-[15%] z-10 mx-auto flex h-[30%] w-[70%] rotate-[10deg] items-center justify-center rounded-xl border-[5px] border-red-500 bg-red-600/90 p-4 text-4xl text-white"
      style={{
        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      }}
    >
      <div className="relative">
        Sold Out!
        <span className="absolute left-[74%] top-[41%] hidden -rotate-90 font-sans text-xs font-medium group-hover:block">
          (Sorry)
        </span>
      </div>
    </figure>
  );
};

export default SoldOut;
