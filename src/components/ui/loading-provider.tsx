import React, { FC, ReactNode } from 'react';
import { LoadingSpinner } from '@components';

export const LoadingProvider: FC<{ loading: boolean; children: ReactNode }> = ({
  children,
  loading,
}) => {
  return (
    <>
      {loading ? (
        <div className="flex h-full flex-row items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        { children }
      )}
    </>
  );
};
