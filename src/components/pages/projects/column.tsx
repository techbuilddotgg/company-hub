import Ticket from '@components/pages/projects/ticket';
import { Droppable } from 'react-beautiful-dnd';
import React from 'react';

interface ColumnProps {
  data: {
    id: string;
    name: string;
    tickets: {
      content: string;
      id: string;
    }[];
  };
}
const Column = ({ data }: ColumnProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>{data.name}</h2>
      <div style={{ margin: 8 }}>
        <Droppable droppableId={data.id} key={data.id}>
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
              {data.tickets.map((ticket, index) => (
                <Ticket key={index} data={ticket} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
export default Column;
