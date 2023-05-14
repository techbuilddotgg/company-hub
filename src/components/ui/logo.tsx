import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href={'/'}>
      <a>
        <h1>
          Tech<span className={'text-blue-600'}>Build</span>
        </h1>
      </a>
    </Link>
  );
};

export { Logo };
