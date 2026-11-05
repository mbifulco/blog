import type { TurnstileGateStatus } from '@hooks/useTurnstileGate';

type TurnstileStatusProps = {
  status: TurnstileGateStatus;
  onRetry: () => void;
};

const TurnstileStatus: React.FC<TurnstileStatusProps> = ({
  status,
  onRetry,
}) => (
  <p role="status" aria-live="polite" className="text-sm text-gray-700">
    {status === 'waiting' &&
      'Checking that you’re a person. Your signup will go through in a moment.'}
    {status === 'error' && (
      <>
        We couldn’t finish our spam check. A content blocker or privacy setting
        is the usual cause. Allow challenges.cloudflare.com and try again.{' '}
        <button
          type="button"
          onClick={onRetry}
          className="font-semibold text-pink-700 underline underline-offset-2 hover:text-pink-800"
        >
          Try again
        </button>
      </>
    )}
  </p>
);

export default TurnstileStatus;
