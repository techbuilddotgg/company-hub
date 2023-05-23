import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';
import { PageHeader } from '@components';

const Calendar = () => {
  return (
    <div className={'overflow-x-hidden'}>
      <PageHeader>
        <h1 className="text-3xl font-bold">Calendar</h1>
      </PageHeader>
      <CalendarScheduler />
    </div>
  );
};

export default Calendar;
