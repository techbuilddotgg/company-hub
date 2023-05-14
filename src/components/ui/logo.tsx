import React from 'react';
import Link from 'next/link';
import { AppRoute } from '@constants/app-routes';

const Logo = () => {
  return (
    <Link href={AppRoute.HOME}>
      <a>
        <h1>
          Tech<span className={'text-blue-600'}>Build</span>
        </h1>
      </a>
    </Link>
  );
};

export { Logo };
