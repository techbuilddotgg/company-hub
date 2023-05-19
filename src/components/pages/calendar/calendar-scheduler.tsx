import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import { trpc } from '@utils/trpc';
import { EventModal } from '@components/pages/calendar/event-modal';
import {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
} from '@fullcalendar/core';
import { AddEventType } from '../../../shared/types/calendar.types';

const CalendarScheduler = () => {
  const { mutate: updateEvent } = trpc.event.update.useMutation({});
  const { data: events } = trpc.event.get.useQuery();

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');
  const [event, setEvent] = React.useState<AddEventType>({
    title: '',
    description: '',
    backgroundColor: '',
    start: '',
    end: '',
  });

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  const handleAddEventSelectAndOpenModal = (selectInfo: DateSelectArg) => {
    console.log(selectInfo);
    setDate(selectInfo.startStr);
    setOpenModal(true);
  };

  const handleUpdateEventSelect = (clickInfo: EventChangeArg) => {
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

  const handleEditEventSelectAndOpenModal = (clickInfo: EventClickArg) => {
    setEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      backgroundColor: clickInfo.event.backgroundColor,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
    });
    setDate(clickInfo.event.startStr);
    setOpenModal(true);
  };

  return (
    <div>
      <div className={'mb-3'}>
        <EventModal
          open={openModal}
          setOpen={() => setOpenModal(!openModal)}
          date={date}
          event={event}
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
        eventChange={handleUpdateEventSelect}
        eventBorderColor={'#a9a9a9'}
        select={handleAddEventSelectAndOpenModal}
        eventClick={handleEditEventSelectAndOpenModal}
      />
    </div>
  );
};

export default CalendarScheduler;
