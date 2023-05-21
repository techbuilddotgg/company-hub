import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Column from '@components/pages/project/column';
import { DraggableElementType } from '@components/pages/project/types';
import { reorderElements } from '@components/pages/project/utils';
import { ProjectBoard } from '@prisma/client';
import { trpc } from '@utils/trpc';
import AddColumn from '@components/pages/project/add-column';
import { ProjectColumnFull } from '../../../shared/types/board.types';
import GithubIntegrationDialog from '@components/pages/project/github-integration-dialog';

interface BoardProps {
  data: ProjectBoard;
}

export const Board = ({ data }: BoardProps) => {
  const [columns, setColumns] = useState<ProjectColumnFull[]>([]);
  const sortedColumns = useMemo(
    () => columns.sort((a, b) => a.orderIndex - b.orderIndex),
    [columns],
  );
  const { data: board, refetch } = trpc.board.getById.useQuery(
    { id: data.id },
    {
      onSuccess: (data) => {
        setColumns(data?.projectBoardColumns || []);
      },
    },
  );

  const { mutate: moveTaskMutation } = trpc.board.moveTask.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const { mutate: reorderTasksInColumnMutation } =
    trpc.board.reorderTasksInColumn.useMutation({
      onSuccess: () => {
        refetch();
      },
    });
  const { mutate: reorderColumnsMutation } =
    trpc.board.reorderColumns.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  const reorderColumns = (sourceIndex: number, destinationIndex: number) => {
    setColumns((prevState) => {
      reorderElements(prevState, sourceIndex, destinationIndex);

      reorderColumnsMutation({
        boardId: board?.id || '',
        columns: prevState,
      });

      return [...prevState];
    });
  };

  const reorderTasks = (
    sourceIndex: number,
    destinationIndex: number,
    droppableId: string,
  ) => {
    setColumns((prevState) => {
      const columnIndex = prevState.findIndex(
        (column) => column.id === droppableId,
      );
      const column = prevState[columnIndex];
      if (columnIndex === -1 || !column) return prevState;

      reorderElements(column.projectBoardTasks, sourceIndex, destinationIndex);
      prevState[columnIndex] = column;

      reorderTasksInColumnMutation({
        columnId: droppableId,
        tasks: column.projectBoardTasks,
      });

      return [...prevState];
    });
  };

  const moveTask = (
    sourceIndex: number,
    destinationIndex: number,
    sourceDroppableId: string,
    destinationDroppableId: string,
  ) => {
    const sourceColumnIndex = columns.findIndex(
      (column) => column.id === sourceDroppableId,
    );
    const sourceColumn = columns[sourceColumnIndex];
    const destColumnIndex = columns.findIndex(
      (column) => column.id === destinationDroppableId,
    );
    const destColumn = columns[destColumnIndex];
    const task = sourceColumn?.projectBoardTasks[sourceIndex];

    if (!sourceColumn || !destColumn || !task) return;

    setColumns((prevState) => {
      const [removed] = sourceColumn.projectBoardTasks.splice(sourceIndex, 1);

      if (removed)
        destColumn.projectBoardTasks.splice(destinationIndex, 0, removed);

      prevState[sourceColumnIndex] = sourceColumn;
      prevState[destColumnIndex] = destColumn;

      moveTaskMutation({
        taskId: task.id,
        sourceColumnId: sourceDroppableId,
        sourceOrderIndex: sourceIndex,
        targetColumnId: destinationDroppableId,
        targetOrderIndex: destinationIndex,
      });

      return [...prevState];
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !columns) return;
    const { source, destination } = result;

    if (result.type === DraggableElementType.COLUMN) {
      reorderColumns(source.index, destination.index);
    } else {
      if (source.droppableId === destination.droppableId) {
        reorderTasks(source.index, destination.index, source.droppableId);
      } else {
        moveTask(
          source.index,
          destination.index,
          source.droppableId,
          destination.droppableId,
        );
      }
    }
  };

  return (
    <div className="h-full max-h-full">
      <GithubIntegrationDialog boardId={data.id} />
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
              {sortedColumns.map((column, index) => (
                <Column
                  data={column}
                  key={column.id}
                  index={index}
                  refetch={refetch}
                />
              ))}
              {provided.placeholder}
              <AddColumn refetch={refetch} boardId={board?.id || ''} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
