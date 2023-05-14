import React from 'react';
import dynamic from 'next/dynamic';
import TaskList from '@components/pages/project/task-list';
import AddTask from '@components/pages/project/add-task';
import { ProjectColumnFull } from '../../../shared/types/board.types';
import { Button, Card, CardFooter } from "@components";

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
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className='bg-gray-100 mr-4 flex flex-col items-center py-4 w-96'
        >
          <h2>{data.name}</h2>
          <div>
            <TaskList id={data.id} data={data.projectBoardTasks} />
            <AddTask columnId={data.id} refetch={refetch} />
          </div>
          <CardFooter>
            <Button type="submit">Delete</Button>
          </CardFooter>

        </Card>
      )}
    </Draggable>
  );
};
export default Column;
