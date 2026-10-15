import { format } from 'date-fns';

import clsxm from '@utils/clsxm';

type PublishDateProps = {
  date: string | Date | number;
  className?: string;
};

const PublishDate: React.FC<PublishDateProps> = ({ date, className }) => {
  const formattedDate = new Date(date);
  if (isNaN(formattedDate.getTime())) {
    return null;
  }
  return (
    <time
      className={clsxm('text-lg', className)}
      dateTime={formattedDate.toUTCString()}
    >
      {format(formattedDate, 'MMM d, yyyy')}
    </time>
  );
};

export default PublishDate;
