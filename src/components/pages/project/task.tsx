import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ProjectBoardTask } from '@prisma/client';

interface TicketProps {
  data: ProjectBoardTask;
  index: number;
}
const Task = ({ data, index }: TicketProps) => {
  return (
    <Draggable key={data.id} draggableId={data.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: 16,
            margin: '0 0 8px 0',
            minHeight: '50px',
            backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
            color: 'white',
            ...provided.draggableProps.style,
          }}
        >
          {data.name}
        </div>
      )}
    </Draggable>
  );
};
export default Task;
