import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';
import { EventModal } from '@components';

const Calendar = () => {
  return (
    <div>
      <div>Calendar</div>
      <div className={'mb-3'}>
        <EventModal />
      </div>
      <CalendarScheduler />
    </div>
  );
};

export default Calendar;
