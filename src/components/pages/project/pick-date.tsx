import React from 'react';
import { format } from "date-fns"
import {
  Button, Calendar,
  Popover, PopoverContent,
  PopoverTrigger
} from "@components";
import { CalendarIcon } from "lucide-react";
import { cn } from "@utils/classNames";


interface PickDateProps {
  date?: Date
  setDate: (open: Date | undefined) => void;
}
const PickDate = ({ date ,setDate }: PickDateProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
export default PickDate;
