import React from 'react';
import CalendarScheduler from '@components/pages/calendar/calendar-scheduler';

const Calendar = () => {
  return (
    <div>
      <div>Calendar</div>
      <div className="md:flex">
        <div className="md:flex-grow">
          <div className="md:flex md:flex-col">
            <CalendarScheduler />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
