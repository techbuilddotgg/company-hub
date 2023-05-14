import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { Button, DialogContent, Input, Textarea } from "@components";

interface FormData {
  name: string;
  description: string;
}

export const TaskModal: FC = () => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <DialogContent>
      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit(onSubmit)}>
        <Input label={'Name'} {...register('name')} />
        <Textarea label={'Description'} {...register('description')} rows={5} />
        <div className="flex justify-between">
          <Button  type={'submit'} variant="destructive">
            Delete
          </Button>
          <Button type={'submit'}>
            Update
          </Button>
        </div>

      </form>
    </DialogContent>

  );
};


