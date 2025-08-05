import ErrorPage from '@components/ErrorPage';

export default function Custom404() {
  return (
    <ErrorPage
      statusCode={404}
      title="404"
      message="Page not found. The page you're looking for doesn't exist."
    />
  );
}
