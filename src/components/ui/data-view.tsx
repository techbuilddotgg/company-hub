import React from 'react';
import { LoadingPage } from '@components';

interface DataViewProps<T> {
  loading: boolean;
  children: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
  data: T | null | undefined;
}

export const DataView = <T,>({
  loading,
  data,
  children,
  fallback,
}: DataViewProps<T>) => {
  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : !data ? (
        fallback ?? <div>no data</div>
      ) : (
        children(data)
      )}
    </>
  );
};
