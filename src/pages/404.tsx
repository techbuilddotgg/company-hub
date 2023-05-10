import React from 'react';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className={'flex h-[80%] flex-col items-center justify-center gap-4'}>
      <div className={'text-6xl font-bold'}>404</div>
      <h1 className={'font-semibold'}>Ups! This page does not exist.</h1>
      <Button variant={'default'} onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

export default NotFoundPage;
