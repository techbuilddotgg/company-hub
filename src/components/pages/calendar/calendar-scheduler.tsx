import React, { useEffect } from 'react';
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
import { AddEventType } from '@shared/types/calendar.types';
import { useUser } from '@clerk/nextjs';
import { useNavigationStore } from '../../../store/navigation-store';

const CalendarScheduler = () => {
  const isNavigationOpened = useNavigationStore((state) => state.isOpened);
  const [key, setKey] = React.useState<string>('ok');
  const { user } = useUser();
  const { mutate: updateEvent } = trpc.event.update.useMutation();
  const { data: events, refetch: refetchEvents } = trpc.event.get.useQuery();

  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>('');
  const [event, setEvent] = React.useState<AddEventType | undefined>();

  const weekends = {
    weekendsVisible: true,
    currentEvents: [],
  };

  const handleAddEventSelectAndOpenModal = (selectInfo: DateSelectArg) => {
    setEvent(undefined);
    setDate(selectInfo.startStr);
    setOpenModal(true);
  };

  const handleUpdateEventSelect = (clickInfo: EventChangeArg) => {
    if (clickInfo.event.extendedProps.authorId !== user?.id) return;
    const event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      backgroundColor: clickInfo.event.backgroundColor,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      authorId: clickInfo.event.extendedProps.authorId,
      users: clickInfo.event.extendedProps.users.map(
        (user: { userId: string }) => user.userId,
      ),
    };

    updateEvent(event);
  };

  const handleEditEventSelectAndOpenModal = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.authorId !== user?.id) return;
    setEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      backgroundColor: clickInfo.event.backgroundColor,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      authorId: clickInfo.event.extendedProps.authorId,
      users: clickInfo.event.extendedProps.users.map(
        (user: { userId: string }) => user.userId,
      ),
    });
    setDate(clickInfo.event.startStr);
    setOpenModal(true);
  };

  useEffect(() => {
    const update = setTimeout(() => {
      setKey(isNavigationOpened + '');
    }, 150);
    return () => clearTimeout(update);
  }, [isNavigationOpened]);

  return (
    <div
      className={
        'container-calendar fc-right fc-prev-button, fc-right fc-next-button mb-16 mt-10'
      }
      key={key}
    >
      <div className={'mb-3'}>
        {user?.id && (
          <EventModal
            open={openModal}
            setOpen={() => setOpenModal(!openModal)}
            date={date}
            event={event}
            user={user}
            refetch={refetchEvents}
          />
        )}
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
        dayMaxEvents={true}
        allDaySlot={false}
        editable={true}
        nowIndicator={true}
        height={'85vh'}
        eventBorderColor={'#a9a9a9'}
        eventChange={handleUpdateEventSelect}
        eventClick={handleEditEventSelectAndOpenModal}
        select={handleAddEventSelectAndOpenModal}
        dayHeaderClassNames={'text-sm text-gray-500 font-semibold'}
        viewHeight={'auto'}
      />
    </div>
  );
};

export default CalendarScheduler;
