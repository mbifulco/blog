import GooseMark from './GooseMark';

/** A goose that waddles right to left along the top edge of its positioned parent. */
const GooseWalker: React.FC = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute bottom-full left-0 h-12 w-full overflow-hidden"
  >
    <div className="goose-walker absolute bottom-0 left-0 w-20">
      <GooseMark
        variant="outline"
        frame="charge"
        className="goose-frame-stand w-full"
      />
      <GooseMark
        variant="outline"
        frame="chargeStep"
        className="goose-frame-step absolute inset-0 w-full"
      />
    </div>
  </div>
);

export default GooseWalker;
