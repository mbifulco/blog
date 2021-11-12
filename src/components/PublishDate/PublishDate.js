import { Text } from '@chakra-ui/react';
import formatDate from '../../utils/format-date';

const PublishDate = ({ date }) => {
  return <time dateTime={date}>{formatDate(date, 'MMMM dd, yyyy')}</time>;
};

export default PublishDate;
