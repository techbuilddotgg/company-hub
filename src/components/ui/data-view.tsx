import React from 'react';
import { LoadingPage } from '@components';

interface DataViewProps<T> {
  isLoading: boolean;
  data: T | null | undefined;
  children: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
  isError?: boolean;
}

export const DataView = <T,>({
  isLoading,
  isError,
  data,
  children,
  fallback,
}: DataViewProps<T>) => {
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !data ? (
        fallback ?? <div>no data</div>
      ) : (
        children(data)
      )}
    </>
  );
};
