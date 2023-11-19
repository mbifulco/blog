import Navbar from '@components/Navbar/Navbar';
import { SiteAnnouncement } from '@components/SiteAnnouncement';
import MDXProviderWrapper from '../../utils/MDXProviderWrapper';
import Footer from '../footer';

const DefaultLayout = ({ children }) => {
  return (
    <MDXProviderWrapper>
      <div className="z-[100] h-1 w-full bg-pink-400" />
      <div className="w-full pt-6">
        <div className="mx-auto my-0 flex w-full flex-col gap-8 px-2 py-0 sm:px-4 lg:p-0">
          <Navbar />

          <SiteAnnouncement />

          <div className="mx-auto flex flex-col gap-8 lg:w-[50rem]">
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </MDXProviderWrapper>
  );
};

export default DefaultLayout;
