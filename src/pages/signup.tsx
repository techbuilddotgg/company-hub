import { SignUp } from '@clerk/nextjs';
import { AppRoute } from '@constants/app-routes';
import Head from 'next/head';
import React from 'react';

const SignUpPage = () => (
  <>
    <Head>
      <title>Sign Up</title>
    </Head>
    <div className="flex h-5/6 items-center justify-center">
      <SignUp signInUrl={AppRoute.SIGN_IN} />
    </div>
  </>
);

export default SignUpPage;
