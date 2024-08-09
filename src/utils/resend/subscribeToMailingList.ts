'use server';

type MailingListSubscriber = {
  email: string;
  name?: string;
  details: unknown;
};

const subscribeToMailingList = ({
  email,
  name,
  details,
}: MailingListSubscriber) => {
  console.log('Subscribing to mailing list...');
  console.log('Email:', email);
  console.log('Name:', name);
  console.log('Details:', details);
};

export default subscribeToMailingList;
