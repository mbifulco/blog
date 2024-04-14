import Flower from '@components/Colophon/Flower';

const Colophon = () => {
  return (
    <div className="grid grid-cols-3">
      <span />
      <div className="flex flex-row items-center justify-evenly gap-4 text-6xl text-pink-600">
        <span>*</span>
        <Flower className="-mt-5 h-16 w-16 rotate-[20deg] text-gray-200/80" />
        <span>*</span>
      </div>
      <span />
    </div>
  );
};

export default Colophon;
