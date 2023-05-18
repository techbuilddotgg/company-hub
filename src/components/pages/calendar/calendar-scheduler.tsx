import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';

const CalendarScheduler = () => {
  const { data: events } = trpc.event.get.useQuery();
  const handleAddEventSelectAndOpenModal = () => {
    //should open modal
  };

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  return (
    <div>
      <FullCalendar
        plugins={[
          timeGridPlugin,
          dayGridPlugin,
          interactionPlugin,
          momentPlugin,
        ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="en-gb"
        weekends={weekends.weekendsVisible}
        events={events ? events : []}
        longPressDelay={1000}
        eventLongPressDelay={1000}
        selectLongPressDelay={1000}
        select={handleAddEventSelectAndOpenModal}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        allDaySlot={false}
        editable={true}
        nowIndicator={true}
        height={'700px'}
      />
    </div>
  );
};

export default CalendarScheduler;
