import Task from '@components/pages/project/task';
import { Droppable } from 'react-beautiful-dnd';
import React from 'react';
import { DraggableElementType } from '@components/pages/project/types';
import { ProjectBoardTasks } from '@prisma/client';

interface TicketListProps {
  id: string;
  data: ProjectBoardTasks[];
}
const TaskList = ({ data, id }: TicketListProps) => {
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
          {data.map((task, index) => (
            <Task key={index} data={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
export default TaskList;
