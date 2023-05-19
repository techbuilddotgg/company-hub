import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';
import { EventModal } from '@components/pages/calendar/event-modal';

const CalendarScheduler = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const { data: events } = trpc.event.get.useQuery();
  const [date, setDate] = React.useState<string>('');

  const handleAddEventSelectAndOpenModal = (info: { dateStr: string }) => {
    setDate(info.dateStr);
    setOpenModal(true);
  };

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  return (
    <div>
      <div className={'mb-3'}>
        <EventModal
          open={openModal}
          setOpen={() => setOpenModal(!openModal)}
          date={date}
        />
      </div>
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
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        allDaySlot={false}
        editable={true}
        nowIndicator={true}
        height={'700px'}
        dateClick={handleAddEventSelectAndOpenModal}
        eventBorderColor={'#a9a9a9'}
      />
    </div>
  );
};

export default CalendarScheduler;
