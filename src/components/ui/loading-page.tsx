import React from 'react';
import { LoadingSpinner } from '@components';

export const LoadingPage = () => {
  return (
    <div className="flex h-full flex-row items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};
