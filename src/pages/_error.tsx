import type { NextPageContext } from 'next';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

type ErrorProps = {
  statusCode: number;
  hasGetInitialPropsRun: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (err && posthog) {
      posthog.capture('error_page_view', {
        error_message: err.message,
        error_stack: err.stack,
        status_code: statusCode,
        has_get_initial_props_run: hasGetInitialPropsRun,
        page_url: window.location.href,
      });
    }
  }, [err, posthog, statusCode, hasGetInitialPropsRun]);

  if (statusCode === 404) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-800">
        {statusCode || 'Client-side error'}
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        {statusCode
          ? `A ${statusCode} error occurred on server`
          : 'An error occurred on client'}
      </p>
      <p className="mt-2 text-gray-500">
        Something went wrong. Please try again later.
      </p>
    </div>
  );
}

Error.getInitialProps = async (ctx: NextPageContext) => {
  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  // Log server-side errors to PostHog if running on server
  if (err && typeof window === 'undefined') {
    const posthog = await import('posthog-node');
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (posthogKey) {
      const client = new posthog.PostHog(posthogKey);

      client.capture({
        distinctId: 'server-error',
        event: 'server_error',
        properties: {
          error_message: err.message,
          error_stack: err.stack,
          status_code: statusCode,
          url: ctx.asPath,
          user_agent: ctx.req?.headers['user-agent'],
        },
      });

      await client.shutdown();
    }
  }

  return {
    statusCode,
    hasGetInitialPropsRun: true,
    err,
  };
};

export default Error;
