import React, { FormEvent } from 'react';
import dynamic from 'next/dynamic';
import TaskList from '@components/pages/project/task-list';
import AddTask from '@components/pages/project/add-task';
import { ProjectBoardColumnType } from '@shared/types/board.types';
import { AlertDialogButton, Card } from '@components';
import { trpc } from '@utils/trpc';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { capitalize } from '@utils/capitalize';
import { useUser } from '@clerk/nextjs';

const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false },
);

interface FormData {
  name: string;
}

interface ColumnProps {
  data: ProjectBoardColumnType;
  index: number;
  refetch: () => void;
}
const Column = ({ data, index, refetch }: ColumnProps) => {
  const form = useForm<FormData>({
    defaultValues: { name: data.name },
  });
  const { mutate: deleteColumnMutation, isLoading: isDeleteColumnLoading } =
    trpc.board.deleteColumn.useMutation({
      onSuccess: () => refetch(),
    });
  const { user } = useUser();

  const { mutate: updateColumnMutation } =
    trpc.board.updateColumn.useMutation();

  const setColumnName = (e: FormEvent) => {
    if (e.currentTarget.textContent) {
      form.setValue('name', capitalize(e.currentTarget.textContent));
    }
  };

  const saveColumnName = () => {
    updateColumnMutation({
      id: data.id,
      name: capitalize(form.getValues('name')),
    });
  };

  const deleteColumn = () => {
    deleteColumnMutation({ id: data.id });
  };

  return (
    <Draggable
      draggableId={data.id}
      index={index}
      isDragDisabled={user?.publicMetadata.isAdmin == false}
    >
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mr-4 flex h-min w-96 flex-col items-center bg-gray-100 py-4"
        >
          <div className="flex w-full flex-row justify-between">
            <h2
              className="px-2 py-1"
              contentEditable={Boolean(user?.publicMetadata.isAdmin)}
              suppressContentEditableWarning
              onInput={setColumnName}
              onBlur={saveColumnName}
              autoCapitalize="on"
            >
              {form.getValues('name')}
            </h2>
            <>
              {user?.publicMetadata.isAdmin && (
                <AlertDialogButton
                  handleAction={deleteColumn}
                  buttonVariant={'ghost'}
                  buttonText={<Trash2 color="black" size={22} />}
                  title={'Delete column'}
                  description={'Are you sure you want to delete this column?'}
                  isActionLoading={isDeleteColumnLoading}
                />
              )}
            </>
          </div>

          <div className="flex flex-grow flex-col">
            <TaskList
              id={data.id}
              data={data.projectBoardTasks}
              refetch={refetch}
            />
            <AddTask columnId={data.id} refetch={refetch} />
          </div>
        </Card>
      )}
    </Draggable>
  );
};
export default Column;
