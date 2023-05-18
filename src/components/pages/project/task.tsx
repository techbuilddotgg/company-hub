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
import { Clock3, User2 } from 'lucide-react';
import { format } from "date-fns";
import { trpc } from "@utils/trpc";


interface TicketProps {
  task: ProjectBoardTask;
  index: number;
  refetch: () => void;

}
const Task = ({ task, index, refetch }: TicketProps) => {
  const [openTaskDialog, setOpenTaskDialog] = React.useState(false);
  const {data: taskType} = trpc.board.getTaskType.useQuery({ taskTypeId: task?.taskTypeId || ''}, {
    enabled: Boolean(task?.taskTypeId)
  });

  const { data: users } = trpc.users.findAll.useQuery();
  const {data: assignedUsers} = trpc.board.getUsersAssignedToTask.useQuery({ taskId: task.id});

  return (
    <Dialog open={openTaskDialog}>
      <div
        className="w-full"
        onClick={() => setOpenTaskDialog(true)}
      >
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="mb-4 rounded-lg bg-white shadow p-0"
            >
              <CardHeader className='p-0 flex flex-row justify-between items-stretch'>
                <CardTitle className="text-left p-3">{task.name}</CardTitle>
                {taskType &&
                  <span className={`w-1/4 rounded-sm bg-gray-500 py-2 self-start justify-self-start text-center text-sm font-semibold text-white p-2 ml-auto mt-0`}>
                  {taskType?.name}
                  </span>
                }

              </CardHeader>
              {assignedUsers && users && assignedUsers.length !== 0 && (
                <CardContent className="px-3 pb-2">
                  <div className="flex items-center">
                    <User2 color="gray" size={18} />
                    {assignedUsers.map((assignedUserId, index) => {
                      const user = users.find((user) => user.id === assignedUserId);
                      return (
                        user && (
                          <span key={user.id} className="text-sm text-gray-600 ml-2">{user.username}{index !== assignedUsers.length - 1 && ","}</span>
                        )
                      );
                    })}
                  </div>
                </CardContent>
              )}
              <CardFooter className='px-3 pb-2'>
                <div className='flex items-center'>
                  {task.deadLine &&
                    <>
                      <Clock3 color="gray" size={18} />
                      <span className="text-sm text-gray-600 ml-2">{format(task?.deadLine, "PPP")}</span>
                    </>
                  }
                </div>
              </CardFooter>
            </Card>
          )}
        </Draggable>
      </div>
      <TaskModal
        task={task}
        refetch={refetch}
        setOpenTaskDialog={setOpenTaskDialog}
      />
    </Dialog>
  );
};
export default Task;
