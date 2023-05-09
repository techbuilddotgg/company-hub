import React from 'react';
import {
  AlertDialogButton,
  Answer,
  Button,
  PageHeader,
  VotingButton,
} from '@components';

const QuestionPage = () => {
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-row gap-2 border-b'}>
        <div className={'grow'}>
          <PageHeader title={'Ki mamo skrite banane?'} />
          <p className={'text-gray-500'}>Asked 2 min ago</p>
        </div>
        <Button>Edit</Button>
        <AlertDialogButton
          buttonText={'Delete'}
          title={'Delete question'}
          description={'Are you sure you want to delete this question?'}
        />
      </div>

      <div className={'flex flex-row items-center gap-4'}>
        <VotingButton counter={0} />
        <div>
          <h2
            className={'text-xl font-semibold text-gray-800 dark:text-gray-100'}
          >
            Description
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          </p>
        </div>
      </div>

      <h2 className={'text-xl font-semibold text-gray-800 dark:text-gray-100'}>
        Answers: 2
      </h2>
      <Answer
        username={'Joža'}
        votes={2}
        text={'Boi naš joža žena ga boža'}
        isCorrect
      />
      <Answer username={'Božo'} votes={2} text={'Ne tak lepo po malen'} />
    </div>
  );
};

export default QuestionPage;
