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
  DialogTrigger,
} from '@components';
import { TaskModal } from '@components/pages/project/task-modal';

interface TicketProps {
  data: ProjectBoardTask;
  index: number;
  refetch: () => void;
}
const Task = ({ data, index, refetch }: TicketProps) => {
  const [openTaskDialog, setOpenTaskDialog] = React.useState(false);
  return (
    <Dialog open={openTaskDialog}>
      <DialogTrigger className="w-full" onClick={() => setOpenTaskDialog(true)}>
        <Draggable key={data.id} draggableId={data.id} index={index}>
          {(provided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="my-4 rounded-lg bg-white p-4 shadow"
            >
              <CardHeader>
                <span
                  className={`mb-4 w-1/2 rounded-sm bg-green-500 py-2 text-center text-sm font-semibold text-white`}
                >
                  {'feature'}
                </span>
                <CardTitle className="text-left">{data.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{data.description}</p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-gray-600">
                  Deadline: {'15.04.2023'}
                </span>
              </CardFooter>
            </Card>
          )}
        </Draggable>
      </DialogTrigger>
      <TaskModal
        id={data.id}
        refetch={refetch}
        setOpenTaskDialog={setOpenTaskDialog}
      />
    </Dialog>
  );
};
export default Task;
