import ErrorPage from '@components/ErrorPage';

export default function Custom500() {
  return (
    <ErrorPage
      statusCode={500}
      title="500"
      message="A server error occurred. Please try again later."
    />
  );
}
