import React, { FC } from 'react';
import { LabelColorsType } from '@components/pages/calendar/types';

const labels: { color: string }[] = [
  {
    color: LabelColorsType.RED,
  },
  {
    color: LabelColorsType.GREEN,
  },
  {
    color: LabelColorsType.YELLOW,
  },
  {
    color: LabelColorsType.BLUE,
  },
];

interface LabelsProps {
  selected: string;
  handleLabelChange: (label: string) => void;
}

const Labels: FC<LabelsProps> = ({ selected, handleLabelChange }) => {
  return (
    <label className="flex items-center gap-2">
      {labels.map((label, index) => (
        <div
          key={index}
          className={`h-4 w-4 cursor-pointer rounded-full ${
            selected === label.color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
          }`}
          onClick={() => handleLabelChange(label.color)}
          style={{ backgroundColor: label.color }}
        ></div>
      ))}
    </label>
  );
};

export default Labels;
