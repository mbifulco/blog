'use client';

import Navbar from '@components/Navbar/Navbar';
import { SiteAnnouncement } from '@components/SiteAnnouncement';
import MDXProviderWrapper from '../../utils/MDXProviderWrapper';
import Footer from '../footer';
import { PolitePop } from '../PolitePop';

const DefaultLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main>
      <div className="absolute top-[-5px] z-[100] h-6 w-full bg-pink-400" />
      <SiteAnnouncement />
      <div className="w-full pt-8 md:pt-14">
        <div className="mx-auto my-0 flex w-full flex-col gap-8 px-2 py-0 sm:px-4 lg:p-0">
          <Navbar />

          <div className="flex flex-col">
            <MDXProviderWrapper>{children}</MDXProviderWrapper>
            <Footer />
          </div>
        </div>
      </div>
      <PolitePop />
    </main>
  );
};

export default DefaultLayout;
