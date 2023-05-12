import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface TicketProps {
  data: {
    content: string;
    id: string;
  };
  index: number;
}
const Ticket = ({ data, index }: TicketProps) => {
  return (
    <Draggable key={data.content} draggableId={data.id} index={index}>
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
          {data.content}
        </div>
      )}
    </Draggable>
  );
};
export default Ticket;
