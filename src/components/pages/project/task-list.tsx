import Task from '@components/pages/project/task';
import { Droppable } from 'react-beautiful-dnd';
import React, { useMemo } from 'react';
import { DraggableElementType } from '@components/pages/project/types';
import { ProjectBoardTask } from '@prisma/client';

interface TicketListProps {
  id: string;
  data: ProjectBoardTask[];
  refetch: () => void;
}
const TaskList = ({ data, id, refetch }: TicketListProps) => {
  const tasks = useMemo(
    () => data.sort((a, b) => a.orderIndex - b.orderIndex),
    [data],
  );
  return (
    <Droppable droppableId={id} key={id} type={DraggableElementType.TASK}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className=" bg-gray-100 p-4"
        >
          {tasks.map((task, index) => (
            <Task key={index} data={task} index={index} refetch={refetch} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
export default TaskList;
