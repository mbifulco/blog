import { format as DoFormatting, isValid } from 'date-fns';

const FORMAT_STRING = 'MM-dd-yyyy';

export const formatDate = (date, format = FORMAT_STRING) => {
  let workingDate = new Date(date);

  if (!isValid(workingDate)) {
    console.error('invalid date', date);
    return null;
  }

  return DoFormatting(workingDate, format);
};

export default formatDate;
