import Navigation from './Navigation';
import Footer from './Footer';

import './global.css';

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="bg-gray-50  min-h-screen border-t-[18px] border-pink-600 pt-8">
      <div className="container mx-auto">
        <Navigation />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;
