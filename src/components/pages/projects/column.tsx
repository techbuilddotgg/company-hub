import React from 'react';
import Task, { TaskProps } from './task';

interface ColumnProps {
  name: string;
  cards: TaskProps[];
  onAddCard: () => void;
}

export const Column: React.FC<ColumnProps> = ({ name, cards, onAddCard }) => {
  return (
    <div className="mr-4 w-80 rounded-lg bg-gray-100 p-4">
      <h2 className="mb-4 text-lg font-bold">{name}</h2>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <Task key={index} {...card} />
        ))}
      </div>
      <button className="mt-4 px-4 py-2 text-gray-400" onClick={onAddCard}>
        + Add Card
      </button>
    </div>
  );
};
