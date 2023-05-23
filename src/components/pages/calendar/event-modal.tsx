import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
  TimePicker,
  UserSelection,
} from '@components';
import Labels from '@components/pages/calendar/labels';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateRange } from 'react-day-picker';
import { checkTime, formatTime } from '@components/pages/calendar/utils';
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

  const { register, watch, handleSubmit, setValue } = useForm({
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

  const { mutate: addEvent } = trpc.event.add.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Event added successfully',
      });
      refetch();
    },
  });

  const { mutate: updateEvent } = trpc.event.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Event updated successfully',
      });
      refetch();
    },
  });

  const { mutate: deleteEvent } = trpc.event.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Event deleted successfully',
      });
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

      console.log(newEvent);
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
          label={'Title'}
          {...register('title')}
          placeholder="Enter event name"
        />
        <div>
          <label className={'font-semibold'}>Date</label>
          <DatePicker defaultState={date} onStateChange={onDateChange} />
        </div>
      </div>
      <div className="my-2 ml-0.5 flex items-center space-x-2">
        <Checkbox
          id="allDay"
          checked={watchAllDay}
          onCheckedChange={handleOnCheckedChange}
        />
        <label
          htmlFor="allDay"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        label={'Description'}
        {...register('description')}
        rows={3}
        placeholder="Enter event description"
      />
      {(user?.id === event?.authorId || !event) && (
        <UserSelection
          handleCheckedChange={handleSelectionChange}
          selected={selected}
          author={user?.id as string}
        />
      )}
      <div className={'my-2'}>
        <Labels selected={label} handleLabelChange={handleLabelChange} />
      </div>
      <div className={'mt-4 flex items-center justify-between'}>
        <Button type={'submit'}>Save</Button>
        {event && (
          <Button
            onClick={() => {
              event.id && deleteEvent(event.id);
            }}
            variant="outline"
            type={'button'}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
  event?: AddEventType;
  user: authUser;
  refetch: () => void;
}
const EventModal: FC<EventModalProps> = ({
  open,
  setOpen,
  date,
  event,
  user,
  refetch,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" setDialogOpen={setOpen}>
        <DialogHeader>
          <DialogTitle>Add event</DialogTitle>
          <DialogDescription>Add new calendar entry</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <EventModalForm
            currentDate={date}
            event={event}
            user={user}
            setOpen={setOpen}
            refetch={refetch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EventModal };
