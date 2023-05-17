import React, { useState } from 'react';

const labels: { color: string }[] = [
  {
    color: 'red',
  },
  {
    color: 'green',
  },
  {
    color: 'yellow',
  },
  {
    color: 'blue',
  },
];

const Labels = () => {
  const [selected, setSelected] = useState('blue');

  return (
    <label className="flex items-center gap-2">
      {labels.map((label, index) => (
        <div
          key={index}
          className={`h-4 w-4 rounded-full bg-${
            label.color
          }-500 cursor-pointer ${
            selected === label.color ? 'ring-2 ring-gray-200 ring-offset-1' : ''
          }`}
          onClick={() => setSelected(label.color)}
        ></div>
      ))}
    </label>
  );
};

export default Labels;
