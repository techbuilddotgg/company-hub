import { TimePickerTimeFormat } from '@shared/types/calendar.types';
import { DateRange } from 'react-day-picker';

export const formatTime = (
  startTime: TimePickerTimeFormat,
  endTime: TimePickerTimeFormat,
  date: DateRange,
  allDay: boolean,
) => {
  const from = date.from as Date;
  let to = date.to as Date;
  if (allDay) {
    from.setHours(0);
    from.setMinutes(0);
    if (to === undefined) {
      const to = new Date(from);
      to.setHours(24);
      to.setMinutes(0);
      return { from: from.toISOString(), to: to.toISOString() };
    } else {
      to.setHours(24);
      to.setMinutes(0);
      return { from: from.toISOString(), to: to.toISOString() };
    }
  }

  from.setHours(startTime.hours);
  from.setMinutes(startTime.minutes);

  if (to !== undefined) {
    to.setHours(endTime.hours);
    to.setMinutes(endTime.minutes);
    return { from: from.toISOString(), to: to.toISOString() };
  }

  to = new Date(from);
  to.setHours(endTime.hours);
  to.setMinutes(endTime.minutes);
  return { from: from.toISOString(), to: to.toISOString() };
};

export const checkTime = (
  date: DateRange | undefined,
  startTime: TimePickerTimeFormat,
  endTime: TimePickerTimeFormat,
) => {
  if (date?.to === undefined) {
    if (startTime.hours === 24) {
      startTime.hours = 0;
    }
    if (
      startTime.hours === 0 ||
      (startTime.hours === endTime.hours &&
        startTime.minutes < endTime.minutes) ||
      startTime.hours < endTime.hours
    ) {
      return true;
    }
  } else {
    return true;
  }
};

export const formatISODate = (isoTimeString: string) => {
  const date = new Date(isoTimeString);

  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (minutes < 10) {
    return `${day} ${month} ${year}, ${hours}:0${minutes}`;
  }
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};
