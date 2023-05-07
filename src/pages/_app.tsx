import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppType } from 'next/app';
import { trpc } from '@utils/trpc';
import Layout from '@components/layout';
import ErrorBoundary from '@components/error-boundary';

const MyApp: AppType = ({ Component, pageProps, router }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <ErrorBoundary router={router}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
