import React from 'react';
import dynamic from 'next/dynamic';
import TaskList from '@components/pages/project/task-list';
import AddTask from '@components/pages/project/add-task';
import { ProjectColumnFull } from '../../../shared/types/board.types';
import { Button, Card, CardFooter } from '@components';
import { trpc } from '@utils/trpc';

const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false },
);

interface ColumnProps {
  data: ProjectColumnFull;
  index: number;
  refetch: () => void;
}
const Column = ({ data, index, refetch }: ColumnProps) => {
  const { mutate: deleteColumnMutation } =
    trpc.board.deleteColumn.useMutation();

  const deleteColumn = () => {
    deleteColumnMutation({ id: data.id });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mr-4 flex w-96 flex-col items-center bg-gray-100 py-4"
        >
          <h2>{data.name}</h2>
          <div>
            <TaskList
              id={data.id}
              data={data.projectBoardTasks}
              refetch={refetch}
            />
            <AddTask columnId={data.id} refetch={refetch} />
          </div>
          <CardFooter>
            <Button onClick={deleteColumn} type="submit">
              Delete
            </Button>
          </CardFooter>
        </Card>
      )}
    </Draggable>
  );
};
export default Column;
