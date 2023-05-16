import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ProjectBoardTask } from '@prisma/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
} from '@components';
import { TaskModal } from '@components/pages/project/task-modal';
import { Clock3 } from 'lucide-react';


interface TicketProps {
  data: ProjectBoardTask;
  index: number;
  refetch: () => void;
}
const Task = ({ data, index, refetch }: TicketProps) => {
  const [openTaskDialog, setOpenTaskDialog] = React.useState(false);
  return (
    <Dialog open={openTaskDialog}>
      <div
        className="w-full"
        onClick={() => setOpenTaskDialog(true)}
      >
        <Draggable key={data.id} draggableId={data.id} index={index}>
          {(provided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="mb-4 rounded-lg bg-white shadow p-0"
            >
              <CardHeader className='p-0 flex flex-row justify-between items-stretch'>
                <CardTitle className="text-left p-3">{data.name}</CardTitle>
                <span className={`w-1/4 rounded-sm bg-green-500 py-2 self-start justify-self-start text-center text-sm font-semibold text-white p-2 ml-auto mt-0`}>
                  {'feature'}
                </span>
              </CardHeader>
              <CardContent className='px-3 py-0'>
                <p className="mb-4 text-gray-700">{data.description}</p>
              </CardContent>
              <CardFooter className='px-3'>
                <div className='flex items-center'>
                  <Clock3 color="gray" size={18} />
                  <span className="text-sm text-gray-600 ml-2">{'15.04.2023'}</span>
                </div>
              </CardFooter>
            </Card>
          )}
        </Draggable>
      </div>
      <TaskModal
        id={data.id}
        refetch={refetch}
        setOpenTaskDialog={setOpenTaskDialog}
      />
    </Dialog>
  );
};
export default Task;
