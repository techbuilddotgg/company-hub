import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';
import React from 'react';

const SignInPage = () => (
  <>
    <Head>
      <title>Sign In</title>
    </Head>
    <div className="flex h-5/6 items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            footer: 'hidden',
          },
        }}
        path="/signin"
        routing="path"
      />
    </div>
  </>
);

export default SignInPage;
