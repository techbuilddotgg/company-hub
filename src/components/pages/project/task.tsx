import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ProjectBoardTask } from '@prisma/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle, Dialog, DialogTrigger
} from "@components";
import { TaskModal } from "@components/pages/project/task-modal";

interface TicketProps {
  data: ProjectBoardTask;
  index: number;
}
const Task = ({ data, index }: TicketProps) => {
  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <Draggable key={data.id} draggableId={data.id} index={index}>
          {(provided, snapshot) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="bg-white shadow rounded-lg p-4 my-4"
            >
              <CardHeader>
                <span className={`rounded-sm text-center w-1/2 text-white mb-4 text-sm font-semibold bg-green-500 py-2`}>{'feature'}</span>
                <CardTitle className='text-left'>{data.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{data.description}</p>
              </CardContent>
              <CardFooter>
                <span className="text-gray-600 text-sm">Deadline: {'15.04.2023'}</span>
              </CardFooter>
            </Card>
          )}
        </Draggable>
      </DialogTrigger>
      <TaskModal />
    </Dialog>

  );
};
export default Task;
