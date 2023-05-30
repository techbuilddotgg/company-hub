import React, { FC, useEffect, useState } from 'react';
import {
  Checkbox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  LoaderButton,
  ScrollArea,
  Textarea,
  TimePicker,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  UserSelection,
} from '@components';
import Labels from '@components/pages/calendar/labels';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateRange } from 'react-day-picker';
import {
  checkTime,
  formatISODate,
  formatTime,
} from '@components/pages/calendar/utils';
import { trpc } from '@utils/trpc';
import {
  AddEventType,
  TimePickerTimeFormat,
} from '@shared/types/calendar.types';
import { EventSchema } from '@shared/validators/calendar.schemas';
import { useToast } from '@hooks';
import { CheckedState } from '@radix-ui/react-checkbox';
import { authUser } from '@shared/types/user.types';
import { LabelColorsType } from '@components/pages/calendar/types';
import { ClipboardCheck } from 'lucide-react';

interface EventModalFormProps {
  setOpen: (open: boolean) => void;
  currentDate: string;
  event?: AddEventType;
  user: authUser;
  refetch: () => void;
}

const EventModalForm: FC<EventModalFormProps> = ({
  setOpen,
  currentDate,
  event,
  user,
  refetch,
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(currentDate),
  });

  const [startTime, setStartTime] = useState<TimePickerTimeFormat>({
    hours: 0,
    minutes: 0,
  });

  const [endTime, setEndTime] = useState<TimePickerTimeFormat>({
    hours: 0,
    minutes: 0,
  });

  const [label, setLabel] = useState<string>(LabelColorsType.BLUE);

  const [selected, setSelected] = React.useState<string[]>([]);

  const { data: assignedUsers } = trpc.event.getEventUsers.useQuery(
    event?.id || '',
  );

  useEffect(() => {
    if (assignedUsers)
      setSelected(
        assignedUsers.users.map((user: { userId: string }) => user.userId),
      );
  }, [assignedUsers]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      start: '',
      end: '',
      backgroundColor: event?.backgroundColor || label,
      allDay: false,
      users: selected,
    },
  });

  const watchAllDay = watch('allDay');

  const onDateChange = (date: DateRange | undefined) => {
    setDate(date);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartTime({ ...startTime, [e.target.name]: parseInt(e.target.value) });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndTime({ ...endTime, [e.target.name]: parseInt(e.target.value) });
  };

  const handleLabelChange = (label: string) => {
    setLabel(label);
  };

  const handleOnCheckedChange = (value: CheckedState) => {
    setValue('allDay', Boolean(value));
    setStartTime({ hours: 0, minutes: 0 });
    setEndTime({ hours: 24, minutes: 0 });
  };

  const handleSelectionChange = (checked: boolean, user: string) => {
    if (checked) {
      setSelected([...selected, user]);
    } else {
      setSelected(selected.filter((item) => item !== user));
    }
  };

  const handleSelectionAllChange = (checked: boolean, users: string[]) => {
    setSelected(checked ? users : []);
  };

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = new Date(event.end);
      setLabel(event.backgroundColor);

      if (
        start.getHours() === end.getHours() &&
        start.getMinutes() === end.getMinutes()
      ) {
        handleOnCheckedChange(true);
      }
      setStartTime({ hours: start.getHours(), minutes: start.getMinutes() });
      setEndTime({ hours: end.getHours(), minutes: end.getMinutes() });
    } else {
      const now = new Date(currentDate);
      let currentHour = now.getHours();
      let currentMinute = Math.round(now.getMinutes() / 15) * 15;

      if (currentMinute === 60) {
        currentMinute = 0;
        currentHour += 1;
      }
      setStartTime({ hours: currentHour, minutes: currentMinute });
      setEndTime({ hours: currentHour + 1, minutes: currentMinute });
    }
  }, []);

  const { mutate: addEvent, isLoading: isAddEventMutationLoading } =
    trpc.event.add.useMutation({
      onSuccess: () => {
        setOpen(false);
        refetch();
      },
    });

  const { mutate: updateEvent, isLoading: isUpdateEventMutationLoading } =
    trpc.event.update.useMutation({
      onSuccess: () => {
        setOpen(false);
        refetch();
      },
    });

  const { mutate: deleteEvent, isLoading: isDeleteEventMutationLoading } =
    trpc.event.delete.useMutation({
      onSuccess: () => {
        setOpen(false);
        refetch();
      },
    });

  const onSubmit = (data: AddEventType) => {
    if (date?.from === undefined) {
      toast({
        title: 'Invalid date',
        description: 'Please check your date and try again',
      });
    } else if (checkTime(date, startTime, endTime)) {
      const time = formatTime(
        startTime,
        endTime,
        date as DateRange,
        watchAllDay,
      );

      const newEvent = {
        title: data.title,
        description: data.description,
        start: time.from,
        end: time.to,
        backgroundColor: label,
        users: selected,
      };

      if (event) updateEvent({ id: event.id, ...newEvent });
      else addEvent(newEvent);
    } else {
      toast({
        title: 'Invalid time format',
        description: 'Please check your time format and try again',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'flex flex-col gap-2'}>
        <Input
          error={errors.title}
          label={'Title'}
          {...register('title')}
          placeholder={'Enter event name'}
        />
        <div>
          <label className={'font-semibold'}>Date</label>
          <DatePicker defaultState={date} onStateChange={onDateChange} />
        </div>
      </div>
      <div className={'my-2 ml-0.5 flex items-center space-x-2'}>
        <Checkbox
          id={'allDay'}
          checked={watchAllDay}
          onCheckedChange={handleOnCheckedChange}
        />
        <label
          htmlFor={'allDay'}
          className={
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          }
        >
          All day
        </label>
      </div>
      {!watchAllDay && (
        <>
          <label className={'font-semibold'}>Time</label>
          <div className={'mb-2 flex gap-2'}>
            <TimePicker
              defaultTime={startTime}
              onTimeChange={handleStartTimeChange}
            />
            <TimePicker
              defaultTime={endTime}
              onTimeChange={handleEndTimeChange}
            />
          </div>
        </>
      )}
      <Textarea
        error={errors.description}
        label={'Description'}
        {...register('description')}
        rows={3}
        placeholder={'Enter event description'}
      />
      {(user?.id === event?.authorId || !event) && (
        <UserSelection
          handleCheckedChange={handleSelectionChange}
          selected={selected}
          author={user?.id as string}
          handleSelectionAllChange={handleSelectionAllChange}
        />
      )}
      <div className={'my-2'}>
        <label className={'font-semibold'}>Color</label>
        <Labels selected={label} handleLabelChange={handleLabelChange} />
      </div>
      <div className={'mt-4 flex items-center justify-between'}>
        {event && (
          <LoaderButton
            isLoading={isDeleteEventMutationLoading}
            onClick={() => {
              event.id && deleteEvent(event.id);
            }}
            variant="outline"
            type={'button'}
          >
            Delete
          </LoaderButton>
        )}
        <div className={'ml-auto flex'}>
          <LoaderButton
            isLoading={
              isAddEventMutationLoading || isUpdateEventMutationLoading
            }
            type={'submit'}
          >
            Save
          </LoaderButton>
        </div>
      </div>
    </form>
  );
};

const EventTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type={'button'}>
          <ClipboardCheck className={'h-4 w-4 text-blue-600'} />
        </TooltipTrigger>
        <TooltipContent className={'mb-5'} sideOffset={5}>
          This event is generated from project board.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
interface EventModalInfoProps {
  event?: AddEventType;
}
const EventModalInfo: FC<EventModalInfoProps> = ({ event }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div>
        <label className={'font-bold'}>Title</label>
        <p>{event?.title}</p>
      </div>
      {event?.description && (
        <div>
          <label className={'font-bold'}>Description</label>
          <p>{event?.description}</p>
        </div>
      )}
      {event?.start && event?.end && (
        <div>
          <label className={'font-bold'}>Date</label>
          <p>
            <span className={'font-semibold'}>From:</span>{' '}
            {formatISODate(event?.start)}
          </p>
          <p>
            <span className={'font-semibold'}>To:</span>{' '}
            {formatISODate(event?.end)}
          </p>
        </div>
      )}
    </div>
  );
};

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
  event?: AddEventType;
  user: authUser;
  refetch: () => void;
  author: boolean;
}
const EventModal: FC<EventModalProps> = ({
  open,
  setOpen,
  date,
  event,
  user,
  refetch,
  author,
}) => {
  return (
    <Dialog open={open}>
      {!author || event?.taskId ? (
        <DialogContent className={'sm:max-w-[425px]'} setDialogOpen={setOpen}>
          <DialogHeader className={'mx-1'}>
            <DialogTitle className={'flex gap-x-1'}>
              Event Info
              {event?.taskId && <EventTooltip />}
            </DialogTitle>
            <DialogDescription>Calendar entry information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className={'mx-1 grid gap-4'}>
              <EventModalInfo event={event} />
            </div>
          </ScrollArea>
        </DialogContent>
      ) : (
        <DialogContent className={'sm:max-w-[425px]'} setDialogOpen={setOpen}>
          <DialogHeader className={'mx-1'}>
            <DialogTitle>{event ? 'Edit event' : 'Add event'}</DialogTitle>
            <DialogDescription>
              {event ? 'Update calendar entry' : 'Add new calendar entry'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className={'mx-1 grid gap-4'}>
              <EventModalForm
                currentDate={date}
                event={event}
                user={user}
                setOpen={setOpen}
                refetch={refetch}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
};

export { EventModal };
