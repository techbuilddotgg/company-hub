import Task from '@components/pages/project/task';
import { Droppable } from 'react-beautiful-dnd';
import React, { useMemo } from 'react';
import { DraggableElementType } from '@components/pages/project/types';
import { ProjectBoardTaskType } from '@shared/types/board.types';

interface TicketListProps {
  id: string;
  data: ProjectBoardTaskType[];
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
          className="max-h-[700px] min-h-[100px] overflow-y-auto overflow-x-hidden bg-gray-100 py-4"
        >
          <div>
            {tasks.map((task, index) => (
              <Task key={index} task={task} index={index} refetch={refetch} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
export default TaskList;
