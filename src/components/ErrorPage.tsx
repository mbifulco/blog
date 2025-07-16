import React from 'react';

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
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
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
