import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

type BreadcrumbsProps = {
  crumbs: {
    name: string;
    href: string;
  }[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex w-full max-w-full space-x-2 truncate overflow-ellipsis whitespace-nowrap text-sm">
        {crumbs.map((crumb, idx) => {
          return (
            <li className="inline" key={`breadcrumb-${idx}`}>
              <div className="flex items-center">
                <Link
                  className="tex-zinc-600 hover:no-underline"
                  href={crumb.href}
                  title={crumb.name}
                >
                  {crumb.name}
                </Link>
                {idx < crumbs.length - 1 && (
                  <FaChevronRight
                    className="ml-2 text-pink-600"
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
