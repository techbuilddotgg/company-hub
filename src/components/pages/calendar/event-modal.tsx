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
} from '../../../shared/types/calendar.types';
import { EventSchema } from '../../../shared/validators/calendar.schemas';
import { useToast } from '@hooks';

interface EventModalFormProps {
  currentDate: string;
}

const EventModalForm: FC<EventModalFormProps> = ({ currentDate }) => {
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

  const [label, setLabel] = useState('blue');

  const { register, watch, handleSubmit, setValue } = useForm({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: '',
      description: '',
      start: '',
      end: '',
      backgroundColor: label,
      allDay: false,
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

  useEffect(() => {
    const now = new Date();
    let currentHour = now.getHours();
    let currentMinute = Math.round(now.getMinutes() / 15) * 15;

    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour += 1;
    }

    setStartTime({ hours: currentHour, minutes: currentMinute });
    setEndTime({ hours: currentHour + 1, minutes: currentMinute });
  }, []);

  const { mutate: addEvent } = trpc.event.add.useMutation({
    // onSuccess: () => {},
  });

  const onSubmit = (data: AddEventType) => {
    if (date?.from === undefined) {
      toast({
        title: 'Invalid date',
        description: 'Please check your date and try again',
      });
    } else if (!checkTime(date, startTime, endTime)) {
      const time = formatTime(
        startTime,
        endTime,
        date as DateRange,
        watchAllDay,
      );

      const event = {
        title: data.title,
        description: data.description,
        start: time.from,
        end: time.to,
        backgroundColor: label,
      };

      console.log(event);
      addEvent(event);
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
        <Input label={'Title'} {...register('title')} />
        <DatePicker defaultState={date} onStateChange={onDateChange} />
      </div>
      <div className="my-2 ml-0.5 flex items-center space-x-2">
        <Checkbox
          id="allDay"
          checked={watchAllDay}
          onCheckedChange={(value) => setValue('allDay', Boolean(value))}
        />
        <label
          htmlFor="allDay"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          All day
        </label>
      </div>
      {!watchAllDay && (
        <div className={'my-2 flex gap-2'}>
          <TimePicker
            defaultTime={startTime}
            onTimeChange={handleStartTimeChange}
          />
          <TimePicker
            defaultTime={endTime}
            onTimeChange={handleEndTimeChange}
          />
        </div>
      )}
      <Textarea label={'Description'} {...register('description')} rows={3} />
      <div className={'my-2'}>
        <Labels selected={label} handleLabelChange={handleLabelChange} />
      </div>
      <Button className={'ml-auto'} type={'submit'}>
        Add
      </Button>
    </form>
  );
};

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: string;
}
const EventModal: FC<EventModalProps> = ({ open, setOpen, date }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" setDialogOpen={setOpen}>
        <DialogHeader>
          <DialogTitle>Add event</DialogTitle>
          <DialogDescription>Add new calendar entry</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <EventModalForm currentDate={date} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EventModal };
