import React from 'react';

export const PageUnavailable = () => {
  return (
    <div className={'mt-40 flex h-screen flex-col items-center'}>
      <h1>Sorry, this page isn&apos;t available.</h1>
      <p>
        The link you followed may be broken, or the page may have been removed.
        Go back to Instagram.
      </p>
    </div>
  );
};
