'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@utils/classNames';
import { Button } from '@components/ui/button';
import { Calendar } from '@components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/popover';

export function DatePicker({
  className,
  defaultState,
  onStateChange,
}: {
  className?: string;
  defaultState?: DateRange;
  onStateChange?: (date: DateRange | undefined) => void;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[245px] justify-start text-left font-normal',
              !defaultState && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {defaultState?.from ? (
              defaultState.to ? (
                <>
                  {format(defaultState.from, 'dd LLL y')} -{' '}
                  {format(defaultState.to, 'dd LLL y')}
                </>
              ) : (
                format(defaultState.from, 'dd LLL y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={defaultState?.from}
            selected={defaultState}
            onSelect={onStateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
