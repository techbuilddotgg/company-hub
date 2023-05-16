import React from 'react';

const Label = () => {
  return (
    <label className="flex items-center">
      <div className="relative">
        <input type="radio" name="labelColor" className="hidden" />
        <div className="h-8 w-8 rounded-full bg-red-500"></div>
      </div>
    </label>
  );
};

export default Label;
