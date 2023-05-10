import React, { useState } from 'react';

import { TaskProps } from './task';
import { Column } from '@components/pages/projects/column';

interface ColumnData {
  name: string;
  cards: TaskProps[];
}

export const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnData[]>([
    {
      name: 'To do',
      cards: [],
    },
    {
      name: 'Doing',
      cards: [
        {
          name: 'Finish project',
          tag: 'feature',
          deadline: '25.4.2023',
          description: 'Description.',
        },
        {
          name: 'Fix error',
          tag: 'bug',
          deadline: '25.4.2023',
          description: 'Description.',
        },
      ],
    },
    {
      name: 'Done',
      cards: [],
    },
  ]);

  const [newColumnName, setNewColumnName] = useState('');

  const handleNewColumnNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewColumnName(event.target.value);
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() !== '') {
      setColumns([...columns, { name: newColumnName.trim(), cards: [] }]);
      setNewColumnName('');
    }
  };

  const handleAddCard = (columnIndex: number) => {
    const cardName = prompt('Enter the name of the card:');
    if (cardName !== null && cardName.trim() !== '') {
      const card: TaskProps = {
        name: cardName.trim(),
        tag: 'feature',
        deadline: '4.5.2023',
        description: '',
      };
      const column = columns[columnIndex];
      if (column && column.cards) {
        const newColumns = [...columns];
        newColumns[columnIndex] = {
          ...column,
          cards: [...column.cards, card],
        };
        setColumns(newColumns);
      }
    }
  };

  return (
    <div className="flex">
      {columns.map((column, index) => (
        <Column
          key={index}
          name={column.name}
          cards={column.cards}
          onAddCard={() => handleAddCard(index)}
        />
      ))}
      <div className="mr-4 w-80 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-4 text-lg font-bold">Add a column</h2>
        <input
          type="text"
          className="mr-2 flex-1 rounded-lg border border-gray-400 p-2"
          placeholder="Column name"
          value={newColumnName}
          onChange={handleNewColumnNameChange}
        />
        <button
          className="my-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleAddColumn}
        >
          + Add New Column
        </button>
      </div>
    </div>
  );
};
