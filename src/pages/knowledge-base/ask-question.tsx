import React from 'react';
import { AskQuestionForm, Card, CardContent, PageHeader } from '@components';

const AskQuestion = () => {
  return (
    <div className={'flex flex-col gap-4'}>
      <PageHeader title={'Ask a question'} />
      <Card>
        <CardContent>
          <AskQuestionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AskQuestion;
