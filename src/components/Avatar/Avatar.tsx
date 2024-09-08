import Image from 'next/image';

import clsxm from '@/utils/clsxm';

export type AvatarBaseProps = {
  name?: string;
  src?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type AvatarSizeVariant = 'sm' | 'md' | 'lg' | 'xl';

type AvatarProps = AvatarBaseProps & {
  variant: AvatarSizeVariant;
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  children,
  className,
  name,
  variant = 'md',
  src,
}) => {
  return (
    <div
      className={clsxm(
        'relative inline-block',
        variant === 'sm' && 'h-8 w-8',
        variant === 'md' && 'h-10 w-10',
        variant === 'lg' && 'h-12 w-12',
        variant === 'xl' && 'h-14 w-14'
      )}
    >
      {src ? (
        <Image
          className={clsxm(
            'inline-block rounded-full object-contain',
            variant === 'sm' && 'h-8 w-8',
            variant === 'md' && 'h-10 w-10',
            variant === 'lg' && 'h-12 w-12',
            variant === 'xl' && 'h-14 w-14',
            className
          )}
          src={src}
          alt={name ?? 'Avatar'}
          fill
          sizes={clsxm(
            variant === 'sm' && '32px', // h-8
            variant === 'md' && '40px', // h-10
            variant === 'lg' && '48px', // h-12
            variant === 'xl' && '56px' // h-14
          )}
        />
      ) : (
        <div
          className={clsxm(
            'inline-block rounded-full bg-gray-400',
            variant === 'sm' && 'h-8 w-8',
            variant === 'md' && 'h-10 w-10',
            variant === 'lg' && 'h-12 w-12',
            variant === 'xl' && 'h-14 w-14',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Avatar;
