import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

import clsxm from '@utils/clsxm';

type SiteAnnouncementProps = {
  className?: string;
  sticky?: boolean;
};

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue] as const;
};

const SiteAnnouncement: React.FC<SiteAnnouncementProps> = ({
  className = '',
  sticky = true,
}) => {
  const [bannerDismissed, setBannerDismissed] = useLocalStorage<boolean>(
    'siteAnnouncementDismissed',
    false
  );

  return (
    <div
      className={clsxm(
        'flex w-screen max-w-full items-center justify-center bg-[#2e537f] py-3 transition-all duration-500 ease-in-out',
        sticky && 'sticky top-0 z-[100]',
        className,
        bannerDismissed && 'hidden'
      )}
    >
      <div className="mx-auto flex flex-row gap-4 px-2 text-sm text-white">
        <p>
          Subscribe to{' '}
          <Link
            href="/newsletter"
            className="font-bold text-pink-300 hover:underline"
          >
            💌 Tiny Improvements
          </Link>
          , my weekly newsletter for product builders. It&apos;s a single, tiny
          idea to help you build better products.
        </p>
      </div>
      <button
        onClick={() => setBannerDismissed(true)}
        className="mr-4 text-white hover:text-pink-300"
      >
        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SiteAnnouncement;
