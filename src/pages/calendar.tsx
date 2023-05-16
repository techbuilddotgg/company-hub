import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';
import { EventModal } from '@components';

const Calendar = () => {
  return (
    <div>
      <EventModal />
      <div>Calendar</div>
      <CalendarScheduler />
    </div>
  );
};

export default Calendar;
