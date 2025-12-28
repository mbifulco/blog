import React from 'react';
import Link from 'next/link';
import type { BreadcrumbList as BreadcrumbListSchema, WithContext } from 'schema-dts';

import { StructuredData } from '@components/StructuredData';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/ui/breadcrumb';
import { BASE_SITE_URL } from '@/config';

export type BreadcrumbCrumb = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  crumbs: BreadcrumbCrumb[];
  className?: string;
};

const generateBreadcrumbSchema = (
  crumbs: BreadcrumbCrumb[]
): WithContext<BreadcrumbListSchema> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${BASE_SITE_URL}${crumb.href}`,
    })),
  };
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs, className }) => {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }

  const schemaData = generateBreadcrumbSchema(crumbs);

  return (
    <>
      <StructuredData structuredData={schemaData} />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <React.Fragment key={`breadcrumb-${index}-${crumb.name}`}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
