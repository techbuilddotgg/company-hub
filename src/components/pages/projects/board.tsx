import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from '@components/pages/projects/column';

const itemsFromBackend = [
  { id: 'bfgftrhettrh', content: 'First task' },
  { id: 'hfghgfhrthfgh', content: 'Second task' },
  { id: 'hfkdgfjsdsgj', content: 'Third task' },
  { id: 'ktzj6rhtfdhj54', content: 'Fourth task' },
  { id: 'j65ej76ij656', content: 'Fifth task' },
];

const columnsFromBackend = [
  {
    id: 'column1',
    name: 'Requested',
    tickets: itemsFromBackend,
  },
  {
    id: 'column2',
    name: 'To do',
    tickets: [],
  },
  {
    id: 'column3',
    name: 'In Progress',
    tickets: [],
  },
  {
    id: 'column4',
    name: 'Done',
    tickets: [],
  },
];

export const Board = () => {
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumnIndex = columns.findIndex(
        (column) => column.id === source.droppableId,
      );
      const sourceColumn = columns[sourceColumnIndex];
      const destColumnIndex = columns.findIndex(
        (column) => column.id === destination.droppableId,
      );
      const destColumn = columns[destColumnIndex];

      if (!sourceColumn || !destColumn) return;

      const sourceItems = [...sourceColumn.tickets];
      const destItems = [...destColumn.tickets];

      const [removed] = sourceItems.splice(source.index, 1);

      if (removed) destItems.splice(destination.index, 0, removed);

      sourceColumn.tickets = sourceItems;
      destColumn.tickets = destItems;
      const finalColumns = [...columns];
      finalColumns[sourceColumnIndex] = sourceColumn;
      finalColumns[destColumnIndex] = destColumn;

      setColumns(finalColumns);
    } else {
      const columnIndex = columns.findIndex(
        (column) => column.id === destination.droppableId,
      );
      const column = columns[columnIndex];

      if (!column) return;

      const copiedItems = [...column.tickets];
      const [removed] = copiedItems.splice(source.index, 1);

      if (removed) copiedItems.splice(destination.index, 0, removed);

      column.tickets = copiedItems;
      const finalColumns = [...columns];
      finalColumns[columnIndex] = column;

      setColumns(finalColumns);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <Column data={column} key={column.id} />
        ))}
      </DragDropContext>
    </div>
  );
};
