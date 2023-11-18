import Image from 'next/image';
import clsx from 'clsx';

export type AvatarBaseProps = {
  name?: string;
  src: string;
};

export type AvatarSizeVariant = 'sm' | 'md' | 'lg' | 'xl';

type AvatarProps = AvatarBaseProps & {
  variant: AvatarSizeVariant;
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  className,
  name,
  variant = 'md',
  src,
}) => {
  console.log('coming atcha', src);
  return (
    <div
      className={clsx(
        'inline-block relative',
        variant === 'sm' && 'h-8 w-8',
        variant === 'md' && 'h-10 w-10',
        variant === 'lg' && 'h-12 w-12',
        variant === 'xl' && 'h-14 w-14'
      )}
    >
      {src ? (
        <Image
          className={clsx(
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
          sizes={clsx(
            variant === 'sm' && '32px', // h-8
            variant === 'md' && '40px', // h-10
            variant === 'lg' && '48px', // h-12
            variant === 'xl' && '56px' // h-14
          )}
        />
      ) : (
        <div
          className={clsx(
            'inline-block rounded-full bg-gray-400',
            variant === 'sm' && 'h-8 w-8',
            variant === 'md' && 'h-10 w-10',
            variant === 'lg' && 'h-12 w-12',
            variant === 'xl' && 'h-14 w-14',
            className
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
