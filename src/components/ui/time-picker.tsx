import React, { FC } from 'react';

export interface TimePickerTimeFormat {
  hours: number;
  minutes: number;
}
interface TimePickerProps {
  defaultTime: TimePickerTimeFormat;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TimePicker: FC<TimePickerProps> = ({ defaultTime, onTimeChange }) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeChange(e);
  };

  return (
    <div className="inline-flex rounded-md border p-2 text-sm">
      <select
        id="hours"
        name="hours"
        className="appearance-none bg-transparent px-2 outline-none"
        onChange={handleTimeChange}
        value={defaultTime.hours}
      >
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="02">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
      </select>
      <span className="px-2">:</span>
      <select
        id="minutes"
        name="minutes"
        className="appearance-none bg-transparent px-2 outline-none"
        onChange={handleTimeChange}
        value={defaultTime.minutes}
      >
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
      </select>
    </div>
  );
};

export { TimePicker };
