import { useState } from 'react';

export const CenteredTextDemo = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCentered, setIsCentered] = useState(true);

  const ToggleButton = (
    <button
      className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-2 px-6 rounded w-fit"
      onClick={() => {
        setIsCentered(!isCentered);
      }}
    >
      Toggle the fix
      {/* {isCentered ? (
        <span>My eyes! Un-center this mess</span>
      ) : (
        <span>Wait, show me again</span>
      )} */}
    </button>
  );

  return (
    <>
      <div className="mx-auto">{ToggleButton}</div>
      <div
        className="my-4"
        style={{ textAlign: isCentered ? 'center' : 'inherit' }}
      >
        {children}
      </div>
      {ToggleButton}
    </>
  );
};

export default CenteredTextDemo;
