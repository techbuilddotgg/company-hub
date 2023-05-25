import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components';
import { TaskModal } from '@components/pages/project/task-modal';
import { Clock3, GitBranch, User2 } from 'lucide-react';
import { format } from 'date-fns';
import { trpc } from '@utils/trpc';
import {
  getTaskPriorityBackgroundColor,
  getTaskTypeBackgroundColor,
} from '@utils/color';
import { ProjectBoardTaskType } from '@shared/types/board.types';

interface TaskProps {
  task: ProjectBoardTaskType;
  index: number;
  refetch: () => void;
}

const Task = ({ task, index, refetch }: TaskProps) => {
  const [openTaskDialog, setOpenTaskDialog] = React.useState(false);
  const { data: taskType } = trpc.board.getTaskType.useQuery(
    { taskTypeId: task?.taskTypeId || '' },
    {
      enabled: Boolean(task?.taskTypeId),
    },
  );
  const { data: taskPriority } = trpc.board.getTaskPriority.useQuery(
    { taskPriorityId: task?.taskPriorityId || '' },
    {
      enabled: Boolean(task?.taskPriorityId),
    },
  );

  const { data: users } = trpc.users.findAll.useQuery();
  const { data: assignedUsers } = trpc.board.getUsersAssignedToTask.useQuery({
    taskId: task.id,
  });

  return (
    <Dialog open={openTaskDialog}>
      <div className="w-full" onClick={() => setOpenTaskDialog(true)}>
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="mb-4 rounded-lg bg-white p-0 shadow"
            >
              <CardHeader className="flex flex-row items-stretch justify-between p-0">
                <CardTitle className="p-3 text-left">{task.name}</CardTitle>
                {taskType && (
                  <span
                    className={`ml-auto mt-0 w-1/4 self-start justify-self-start rounded-sm ${getTaskTypeBackgroundColor(
                      taskType.name,
                    )} p-2 py-2 text-center text-sm font-semibold text-white`}
                  >
                    {taskType?.name}
                  </span>
                )}
              </CardHeader>
              <CardContent className="px-3 pb-2">
                {taskPriority && (
                  <Badge
                    className={`mb-2 ${getTaskPriorityBackgroundColor(
                      taskPriority.name,
                    )}`}
                  >
                    {taskPriority?.name}
                  </Badge>
                )}
                {assignedUsers && users && assignedUsers.length !== 0 && (
                  <div className="flex flex-wrap items-center">
                    <User2 color="gray" size={18} />
                    {assignedUsers.map((assignedUserId, index) => {
                      const user = users.find(
                        (user) => user.id === assignedUserId,
                      );
                      return (
                        user && (
                          <span
                            key={user.id}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {user.username}
                            {index !== assignedUsers.length - 1 && ','}
                          </span>
                        )
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-3 pb-2">
                <div
                  className={`flex w-full items-center ${
                    task.deadLine ? 'justify-between' : 'justify-end'
                  }`}
                >
                  {task.deadLine && (
                    <div className="flex flex-row items-center">
                      <Clock3 color="gray" size={18} />
                      <span className="ml-2 text-sm text-gray-600">
                        {format(task?.deadLine, 'PPP')}
                      </span>
                    </div>
                  )}
                  <>
                    {task.connectedBranch && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <GitBranch />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Connected to{' '}
                              <span className="font-semibold">
                                {task.connectedBranch}
                              </span>{' '}
                              branch
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </>
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
        taskTypeName={taskType?.name}
        taskPriorityName={taskPriority?.name}
      />
    </Dialog>
  );
};
export default Task;
