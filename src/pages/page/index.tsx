// This file exists in addition to the redirect in next.config.mjs for /page → /.
// Why? The Next.js config redirect only handles the exact path at the edge, but not all cases (e.g., trailing slashes, direct navigation, or some test runners).
// Having this file ensures that any request to /page (with or without trailing slash) is handled gracefully in all environments, never returns a 404, and always redirects to the home page.

import type { GetServerSideProps } from 'next';
import { createPaginationRedirectProps } from '../../utils/pagination-redirects';

export const getServerSideProps: GetServerSideProps = async () => {
  return createPaginationRedirectProps('/');
};

const PageRedirect = () => null;
export default PageRedirect;
