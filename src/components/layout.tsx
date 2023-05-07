import React, { FC, PropsWithChildren } from 'react';
import Navigation from '@components/navigation';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={'flex h-full flex-col'}>
      <Navigation />
      <main className={'flex-1'}>{children}</main>
    </div>
  );
};

export default Layout;
