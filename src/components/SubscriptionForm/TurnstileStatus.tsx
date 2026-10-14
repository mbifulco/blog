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
        We couldn’t confirm you’re a person. A content blocker is the usual
        cause.{' '}
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
