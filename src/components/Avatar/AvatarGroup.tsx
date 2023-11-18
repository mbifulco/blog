import clsx from 'clsx';

import Avatar from './Avatar';
import type { AvatarBaseProps, AvatarSizeVariant } from './Avatar';

type AvatarGroupProps = {
  people: AvatarBaseProps[];
  variant: AvatarSizeVariant;
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ people, variant }) => {
  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {people.map((person, idx) => {
        return (
          <Avatar
            key={`avatar-group-${idx}-${person.name}`}
            className={clsx(
              idx === 0 && 'z-10',
              idx === 1 && 'z-20',
              idx === 2 && 'z-30',
              idx === 3 && 'z-40',
              idx > 3 && 'z-50'
            )}
            name={person.name}
            src={person.src}
            variant={variant}
          />
        );
      })}
    </div>
  );
};

export default AvatarGroup;
