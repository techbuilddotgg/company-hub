import React, { useState } from 'react'
import Column from './Column'
import { CardProps } from './card'

interface ColumnData {
  name: string
  cards: CardProps[]
}

const Board: React.FC = () => {
  const [columns, setColumns] = useState<ColumnData[]>([
    {
      name: 'To do',
      cards: []
    },
    {
      name: 'Doing',
      cards: [
        {
          name: 'Finish project',
          tag: 'feature',
          deadline: '25.4.2023',
          description: 'Description.'
        },        {
          name: 'Fix error',
          tag: 'bug',
          deadline: '25.4.2023',
          description: 'Description.'
        }
      ]
    },
    {
      name: 'Done',
      cards: []
    },
  ])

  const [newColumnName, setNewColumnName] = useState('')

  const handleNewColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumnName(event.target.value)
  }

  const handleAddColumn = () => {
    if (newColumnName.trim() !== '') {
      setColumns([...columns, { name: newColumnName.trim(), cards: [] }])
      setNewColumnName('')
    }
  }

  const handleAddCard = (columnIndex: number) => {
    const cardName = prompt('Enter the name of the card:');
    if (cardName !== null && cardName.trim() !== '') {
      const card: CardProps = {
        name: cardName.trim(),
        tag: 'feature',
        deadline: '4.5.2023',
        description: ''
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
      <div className="w-80 bg-gray-100 rounded-lg p-4 mr-4">
        <h2 className="text-lg font-bold mb-4">Add a column</h2>
          <input
            type="text"
            className="rounded-lg border-gray-400 border p-2 mr-2 flex-1"
            placeholder="Column name"
            value={newColumnName}
            onChange={handleNewColumnNameChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 my-4"
            onClick={handleAddColumn}
          >
            + Add New Column
          </button>
      </div>
    </div>
  );
};

export default Board;