import { AddEventSchema } from '../validators/calendar.schemas';
import { z } from 'zod';
import React from 'react';

export type AddEventType = z.infer<typeof AddEventSchema>;

export interface TimePickerTimeFormat {
  hours: number;
  minutes: number;
}
export interface TimePickerProps {
  defaultTime: TimePickerTimeFormat;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
