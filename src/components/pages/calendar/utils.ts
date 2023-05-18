import { TimePickerTimeFormat } from '../../../shared/types/calendar.types';
import { DateRange } from 'react-day-picker';

export const formatTime = (
  startTime: TimePickerTimeFormat,
  endTime: TimePickerTimeFormat,
  date: DateRange,
) => {
  const from = date.from as Date;
  from.setHours(startTime.hours);
  from.setMinutes(startTime.minutes);

  if (date.to !== undefined) {
    const to = new Date(date.to);
    to.setHours(endTime.hours);
    to.setMinutes(endTime.minutes);
    return { from: from.toISOString(), to: to.toISOString() };
  }

  const to = new Date(from);
  to.setHours(endTime.hours);
  to.setMinutes(endTime.minutes);

  return { from: from.toISOString(), to: to.toISOString() };
};

export const checkTime = (
  date: DateRange | undefined,
  startTime: TimePickerTimeFormat,
  endTime: TimePickerTimeFormat,
) => {
  if (
    date?.to === undefined &&
    startTime.hours >= endTime.hours &&
    startTime.minutes >= endTime.minutes
  ) {
    return true;
  }
};
