import React, { FC, PropsWithChildren } from 'react';
import { Navigation } from '@components';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={'flex h-full flex-row'}>
      <Navigation />
      <main className={'flex-1 p-10'}>{children}</main>
    </div>
  );
};
