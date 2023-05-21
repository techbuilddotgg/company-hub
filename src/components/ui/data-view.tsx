import React from 'react';
import { LoadingPage } from '@components';

interface DataViewProps<T> {
  isLoading: boolean;
  data: T | undefined | null;
  children: (data: NonNullable<T>) => React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export const DataView = <T,>({
  isLoading,
  loadingComponent,
  data,
  children,
  fallback,
}: DataViewProps<T>) => {
  return (
    <>
      {isLoading
        ? loadingComponent ?? <LoadingPage />
        : !data
        ? fallback ?? <div>no data</div>
        : children(data)}
    </>
  );
};
