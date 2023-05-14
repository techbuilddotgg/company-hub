import Task from '@components/pages/project/task';
import { Droppable } from 'react-beautiful-dnd';
import React, { useMemo } from 'react';
import { DraggableElementType } from '@components/pages/project/types';
import { ProjectBoardTask } from '@prisma/client';

interface TicketListProps {
  id: string;
  data: ProjectBoardTask[];
}
const TaskList = ({ data, id }: TicketListProps) => {
  const tasks = useMemo(
    () => data.sort((a, b) => a.orderIndex - b.orderIndex),
    [data],
  );
  return (
    <Droppable droppableId={id} key={id} type={DraggableElementType.TASK}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
            padding: 4,
            width: 250,
            minHeight: 500,
          }}
        >
          {tasks.map((task, index) => (
            <Task key={index} data={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
export default TaskList;
