import React, { useEffect, useState } from "react";
import Column from './Column'
import { CardProps } from './card'
import { DragDropContext, DropResult } from "react-beautiful-dnd";


interface ColumnData {
  id: string
  name: string
  cards: CardProps[]
  cardIds: string[]
}

const Board: React.FC = () => {

  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  const [columns, setColumns] = useState<ColumnData[]>([
    {
      name: 'To do',
      id: 'column-1',
      cards: [],
      cardIds: []
    },
    {
      name: 'Doing',
      id: 'column-2',
      cards: [
        {
          id: 'task-1',
          name: 'Finish project',
          tag: 'feature',
          deadline: '25.4.2023',
          description: 'Description.',
          index: 2
        },
        {
          id: 'task-2',
          name: 'Test',
          tag: 'bug',
          deadline: '25.4.2023',
          description: 'Description.',
          index: 1
        },
        {
          id: 'task-3',
          name: 'Test3',
          tag: 'bug',
          deadline: '25.4.2023',
          description: 'Description3.',
          index: 3
        },
      ],
      cardIds: ['task-1', 'task-2'],

    },
    {
      name: 'Done',
      id: 'column-3',
      cards: [],
      cardIds: []

    },
  ])

  const [newColumnName, setNewColumnName] = useState('')

  const handleNewColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumnName(event.target.value)
  }

  const handleAddColumn = () => {
    if (newColumnName.trim() !== '') {
      setColumns([...columns, { name: newColumnName.trim(), cards: [], id: newColumnName, cardIds: []}])
      setNewColumnName('')
    }
  }

  const handleAddCard = (columnIndex: number) => {
    const cardName = prompt('Enter the name of the card:');
    if (cardName !== null && cardName.trim() !== '') {
      const card: CardProps = {
        name: cardName.trim(),
        id: cardName.trim(),
        index: 344,
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If the card is dropped outside of a droppable area
    if (!destination) {
      return;
    }

    // If the card is dropped in the same position it started in
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destinationColumn = columns.find(col => col.id === destination.droppableId);

    if (sourceColumn && destinationColumn) {
      // Moving cards between columns
      if (sourceColumn.id !== destinationColumn.id) {
        // Remove the card from the source column's cards array
        const cardIndex = sourceColumn.cards.findIndex(card => card.id === draggableId);
        const card = sourceColumn.cards[cardIndex];
        sourceColumn.cards.splice(cardIndex, 1);

        // Add the card to the destination column's cards array
        const newCard = { ...card! };
        destinationColumn.cards.splice(destination.index, 0, newCard);

        // Update the cardIds arrays for both columns
        const sourceCardIds = Array.from(sourceColumn.cardIds);
        const destinationCardIds = Array.from(destinationColumn.cardIds);
        sourceCardIds.splice(source.index, 1);
        destinationCardIds.splice(destination.index, 0, draggableId);
        sourceColumn.cardIds = sourceCardIds;
        destinationColumn.cardIds = destinationCardIds;
      } else { // Moving cards within the same column
        // Remove the card from the source column's cards array
        const cardIndex = sourceColumn.cards.findIndex(card => card.id === draggableId);
        const card = sourceColumn.cards[cardIndex];
        sourceColumn.cards.splice(cardIndex, 1);

        // Add the card to the same column's cards array at the new index
        if (card) {
          console.log(card);
          sourceColumn.cards.splice(destination.index, 0, card);

        }

        // Update the cardIds array for the same column
        const cardIds = Array.from(sourceColumn.cardIds);
        cardIds.splice(source.index, 1);
        cardIds.splice(destination.index, 0, draggableId);
        sourceColumn.cardIds = cardIds;
      }
    }

    // Update the state
    setColumns([...columns]);
  };




  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        {winReady ? columns.map((column, index) => (
          <Column
            key={index}
            id={column.id}
            name={column.name}
            cards={column.cards}
            onAddCard={() => handleAddCard(index)}
          />
        )): null}
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
    </DragDropContext>

  );
};

export default Board;