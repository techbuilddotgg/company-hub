import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';

const CalendarScheduler = () => {
  const { mutate: addEvent } = trpc.event.add.useMutation();
  // const { data: events } = trpc.event.get.useQuery();

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
        events={[
          {
            title: 'event 1',
            start: '2023-05-19T22:00:00.000Z',
            end: '2023-05-18T22:00:59.132Z',
          },
          {
            title: 'event 2',
            start: '2023-05-18T22:00:51.668Z',
            end: '2023-05-19T18:00:51.668Z',
          },
        ]}
        longPressDelay={1000}
        eventLongPressDelay={1000}
        selectLongPressDelay={1000}
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
