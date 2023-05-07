import React, { FC, PropsWithChildren } from 'react';
import Navigation from '@components/navigation/navigation';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
