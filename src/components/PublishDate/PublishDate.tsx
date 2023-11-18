import formatDate from '../../utils/format-date';

type PublishDateProps = {
  date: string | Date | number;
};

const PublishDate: React.FC<PublishDateProps> = ({ date }) => {
  const formattedDate = new Date(date);
  if (isNaN(formattedDate.getTime())) {
    return null;
  }
  return (
    <time className="text-lg" dateTime={formattedDate.toUTCString()}>
      {formatDate(date, 'MMMM dd, yyyy')}
    </time>
  );
};

export default PublishDate;
