const soldOut = () => {
  return (
    <>
      <style jsx>{`
        .soldout {
          border: 5px solid #ff3333;
          color: white;
          border-radius: 14px;
          padding: 1rem;
          margin: 0 auto;
          transform: rotate(10deg);
          background: rgba(255, 30, 30, 0.9);
          width: 70%;
          height: 30%;
          bottom: 25%;
          left: 15%;
          display: flex;
          align-self: center;
          align-items: center;
          justify-content: center;
          position: absolute;
          z-index: 1;
          font-family:
            Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
          font-size: 36px;

          &:hover {
            & > div::after {
              content: '(Sorry)';
              font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
              font-weight: 500;
              font-size: 9pt;
              display: block;
              text-align: center;
              text-decoration: none;
              position: absolute;
              transform: rotate(-90deg);
              left: 74%;
              top: 41%;
            }
          }
        }
      `}</style>
      <figure className="soldout">
        <div>Sold Out!</div>
      </figure>
    </>
  );
};

export default soldOut;
