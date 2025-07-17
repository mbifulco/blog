export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function paginate<T>(
  items: T[],
  options: PaginationOptions = {}
): PaginatedResult<T> {
  const { page = 1, limit = 10 } = options;

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

export type GetTotalPagesFn = (limit: number) => Promise<{ totalPages: number }>;

export async function generatePaginatedPaths(
  getTotalPages: GetTotalPagesFn,
  limit: number
) {
  const { totalPages } = await getTotalPages(limit);
  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ params: { page: i.toString() } });
  }
  return paths;
}

export async function handlePaginatedStaticProps<T>({
  params,
  getTotalPages,
  limit,
  redirectBase,
  getPageProps,
}: {
  params: { page: string };
  getTotalPages: GetTotalPagesFn;
  limit: number;
  redirectBase: string;
  getPageProps: (page: number) => Promise<{ props: T }>;
}): Promise<{ props: T } | { notFound: true } | { redirect: { destination: string; permanent: boolean } }> {
  const pageParam = params?.page;
  const page = parseInt(pageParam, 10);

  // Handle invalid page parameters (non-numeric, negative, etc.)
  if (isNaN(page) || page < 1 || !pageParam.match(/^\d+$/)) {
    return { notFound: true };
  }

  // Get total pages to determine max page
  const { totalPages } = await getTotalPages(limit);

  // Handle page number too high - redirect to base
  if (page > totalPages) {
    return {
      redirect: {
        destination: redirectBase,
        permanent: false,
      },
    };
  }

  // Handle page 1 - should be at base instead
  if (page === 1) {
    return {
      redirect: {
        destination: redirectBase,
        permanent: false,
      },
    };
  }

  // Return the actual props for the page
  return getPageProps(page);
}
