import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Column from '@components/pages/project/column';
import { DraggableElementType } from '@components/pages/project/types';
import { reorderElements } from '@components/pages/project/utils';
import { ProjectBoard } from '@prisma/client';
import { RouterOutput, trpc } from '@utils/trpc';
import AddColumn from '@components/pages/project/add-column';
import { ProjectBoardColumnType } from '@shared/types/board.types';
import GithubIntegrationDialog from '@components/pages/project/github-integration-dialog';
import Pusher from 'pusher-js';
import { useUser } from '@clerk/nextjs';
import { Checkbox } from '@components/ui/checkbox';

type BoardType = RouterOutput['board']['getById'];

interface BoardProps {
  data: ProjectBoard;
}

export const Board = ({ data }: BoardProps) => {
  const [columns, setColumns] = useState<ProjectBoardColumnType[]>([]);
  const [myTasksChecked, setMyTasksChecked] = useState(false);

  const sortedColumns = useMemo(
    () => columns.sort((a, b) => a.orderIndex - b.orderIndex),
    [columns],
  );
  const { user } = useUser();
  const {
    data: board,
    refetch,
    isLoading: isBoardLoading,
  } = trpc.board.getById.useQuery(
    { id: data.id },
    {
      onSuccess: (data) => {
        setColumns(data?.projectBoardColumns || []);
      },
    },
  );

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || '',
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function () {
      refetch();
    });
  }, []);

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

  const onMyTasksChange = () => {
    setMyTasksChecked(!myTasksChecked);
  };
  console.log(isBoardLoading, board);
  return (
    <div className="h-full max-h-full">
      <>
        {user?.publicMetadata.isAdmin && (
          <GithubIntegrationDialog boardId={data.id} />
        )}
        <div className="mb-4 flex space-x-2">
          <Checkbox
            id={`myTasks`}
            checked={myTasksChecked}
            onCheckedChange={onMyTasksChange}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={`myTasks`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {'Show only my tasks'}
            </label>
          </div>
        </div>
      </>
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
              {!myTasksChecked
                ? sortedColumns.map((column, index) => (
                    <Column
                      data={column}
                      key={column.id}
                      index={index}
                      refetch={refetch}
                    />
                  ))
                : sortedColumns
                    .map((column) => ({
                      ...column,
                      projectBoardTasks: column.projectBoardTasks.filter(
                        (task) =>
                          task.users.some(
                            (assignedUser) => assignedUser.userId === user?.id,
                          ),
                      ),
                    }))
                    .map((column, index) => (
                      <Column
                        data={column}
                        key={column.id}
                        index={index}
                        refetch={refetch}
                      />
                    ))}
              {provided.placeholder}
              <>
                {user?.publicMetadata.isAdmin && (
                  <AddColumn refetch={refetch} boardId={board?.id || ''} />
                )}
              </>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
