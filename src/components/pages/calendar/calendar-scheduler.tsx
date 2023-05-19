import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';
import { EventModal } from '@components/pages/calendar/event-modal';
import { DateSelectArg, EventChangeArg } from '@fullcalendar/core';

const CalendarScheduler = () => {
  const { mutate: updateEvent } = trpc.event.update.useMutation({});
  const { data: events } = trpc.event.get.useQuery();

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  const handleAddEventSelectAndOpenModal = (selectInfo: DateSelectArg) => {
    console.log(selectInfo.startStr);
    setDate(selectInfo.startStr);
    setOpenModal(true);
  };

  const handleEditEventSelectAndOpenModal = (clickInfo: EventChangeArg) => {
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      backgroundColor: clickInfo.event.backgroundColor,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
    };
    updateEvent(event);
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
        locale={'en-gb'}
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
        eventChange={handleEditEventSelectAndOpenModal}
        eventBorderColor={'#a9a9a9'}
        select={handleAddEventSelectAndOpenModal}
      />
    </div>
  );
};

export default CalendarScheduler;
