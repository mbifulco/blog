import React, { useRef } from 'react';
import posthog from 'posthog-js';

type ErrorPageProps = {
  statusCode?: number;
  title?: string;
  message?: string;
};

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  title,
  message,
}) => {
  const hasTrackedError = useRef(false);

  const handleErrorPageViewed = () => {
    if (hasTrackedError.current) return;
    hasTrackedError.current = true;

    posthog.capture('error_page_viewed', {
      status_code: statusCode,
      error_title: title,
      error_message: message,
    });

    // Also capture as an exception for error tracking
    if (statusCode) {
      posthog.captureException(new Error(`Error page ${statusCode}: ${message || title}`));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white" onMouseEnter={handleErrorPageViewed}>
      <h1 className="text-6xl font-bold text-gray-800">
        {statusCode ? statusCode : title ? title : 'Error'}
      </h1>
      {title && !statusCode && (
        <p className="mt-4 text-2xl font-semibold text-gray-700">{title}</p>
      )}
      {message && <p className="mt-4 text-xl text-gray-600">{message}</p>}
      {!message && !title && (
        <p className="mt-4 text-xl text-gray-600">
          Something went wrong. Please try again later.
        </p>
      )}
    </div>
  );
};

export default ErrorPage;
