import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';

const CalendarScheduler = () => {
  const { mutate: addEvent } = trpc.event.add.useMutation();
  const { data: events } = trpc.event.getById.useQuery({ id: '1' });

  const onSubmit = () => {
    addEvent({
      title: 'event 1',
      start: '2023-05-16',
      end: '2023-05-18',
      authorId: '1',
    });
  };

  console.log(events);

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  return (
    <div>
      <button onClick={onSubmit}>add dummy event</button>
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
          { title: 'event 1', date: '2023-05-16' },
          { title: 'event 2', date: '2023-05-18' },
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
