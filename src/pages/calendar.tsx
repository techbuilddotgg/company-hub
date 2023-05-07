import React from 'react';
import { useUser } from '@clerk/nextjs';

const Calendar = () => {
  const user = useUser();

  if (!user.isSignedIn) {
    throw new Error('Do not have access to this page');
  }

  return <div>Calendar</div>;
};

export default Calendar;
