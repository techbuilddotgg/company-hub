import React from 'react';
import { Button, Checkbox, DialogButton, Input, Textarea } from '@components';

const EventModalForm = () => {
  return (
    <form>
      <Input label={'Title'} />
      <div className="flex items-center space-x-2">
        <Checkbox id="all_day" />
        <label
          htmlFor="all_day"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          All day
        </label>
      </div>
      <Textarea label={'Description'} rows={5} />
      <Button className={'ml-auto'} type={'submit'}>
        Add
      </Button>
    </form>
  );
};

const EventModal = () => {
  return (
    <div>
      <DialogButton
        buttonText={'Add event'}
        title={'Add new event'}
        description={'Create new calendar entry'}
        content={<EventModalForm />}
      />
    </div>
  );
};

export { EventModal };
