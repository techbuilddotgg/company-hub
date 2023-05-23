import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';
import { PageHeader } from '@components';

const Calendar = () => {
  return (
    <div className={'overflow-x-hidden'}>
      <PageHeader title="Calendar" />
      <CalendarScheduler />
    </div>
  );
};

export default Calendar;
