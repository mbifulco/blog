'use client';

import Navbar from '@components/Navbar/Navbar';
import { SiteAnnouncement } from '@components/SiteAnnouncement';
import MDXProviderWrapper from '../../utils/MDXProviderWrapper';
import Footer from '../footer';

const DefaultLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main>
      <SiteAnnouncement />
      <div className="w-full pt-4 md:pt-6">
        <div className="mx-auto my-0 flex w-full flex-col gap-8 py-0">
          <Navbar />

          <div className="flex flex-col">
            <div className="px-4">
              <MDXProviderWrapper>{children}</MDXProviderWrapper>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DefaultLayout;
