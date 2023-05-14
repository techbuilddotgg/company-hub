import React from 'react';
import dynamic from 'next/dynamic';
import TaskList from '@components/pages/project/task-list';
import { ProjectBoardColumn, ProjectBoardTasks } from '@prisma/client';

const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false },
);

interface ColumnProps {
  data: ProjectBoardColumn & { projectBoardCard: ProjectBoardTasks[] };
  index: number;
}
const Column = ({ data, index }: ColumnProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...provided.draggableProps.style,
          }}
        >
          <h2>{data.name}</h2>
          <div style={{ margin: 8 }}>
            <TaskList id={data.id} data={data.projectBoardCard} />
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default Column;
