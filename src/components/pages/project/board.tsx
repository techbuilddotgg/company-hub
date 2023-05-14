import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Column from '@components/pages/project/column';
import { DraggableElementType } from '@components/pages/project/types';
import { reorderElements } from '@components/pages/project/utils';
import {
  ProjectBoard,
  ProjectBoardColumn,
  ProjectBoardTasks,
} from '@prisma/client';
import { trpc } from '@utils/trpc';
import AddColumn from '@components/pages/project/add-column';

interface BoardProps {
  data: ProjectBoard;
}
type ColumnType = ProjectBoardColumn & {
  projectBoardCard: ProjectBoardTasks[];
};

export const Board = ({ data }: BoardProps) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const { data: board, refetch } = trpc.board.getById.useQuery(
    { id: data.id },
    {
      onSuccess: (data) => {
        setColumns(data?.ProjectBoardColumn || []);
      },
    },
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !columns) return;
    const { source, destination } = result;

    if (result.type === DraggableElementType.COLUMN) {
      setColumns((prevState) => {
        reorderElements(prevState, source.index, destination.index);
        return [...prevState];
      });
    } else {
      if (source.droppableId === destination.droppableId) {
        setColumns((prevState) => {
          const columnIndex = prevState.findIndex(
            (column) => column.id === source.droppableId,
          );
          const column = prevState[columnIndex];
          if (columnIndex === -1 || !column) return prevState;

          reorderElements(
            column.projectBoardCard,
            source.index,
            destination.index,
          );
          prevState[columnIndex] = column;
          return [...prevState];
        });
      } else {
        const sourceColumnIndex = columns.findIndex(
          (column) => column.id === source.droppableId,
        );
        const sourceColumn = columns[sourceColumnIndex];
        const destColumnIndex = columns.findIndex(
          (column) => column.id === destination.droppableId,
        );
        const destColumn = columns[destColumnIndex];

        if (!sourceColumn || !destColumn) return;

        setColumns((prevState) => {
          const [removed] = sourceColumn.projectBoardCard.splice(
            source.index,
            1,
          );

          if (removed)
            destColumn.projectBoardCard.splice(destination.index, 0, removed);

          prevState[sourceColumnIndex] = sourceColumn;
          prevState[destColumnIndex] = destColumn;

          return [...prevState];
        });
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type={DraggableElementType.COLUMN}
          direction="horizontal"
        >
          {(provided) => (
            <div
              className="inline-flex h-full w-[1500px]"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns.map((column, index) => (
                <Column data={column} key={column.id} index={index} />
              ))}
              <AddColumn refetch={refetch} boardId={board?.id || ''} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
