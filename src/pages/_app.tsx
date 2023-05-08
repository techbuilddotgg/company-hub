import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppType } from 'next/app';
import { trpc } from '@utils/trpc';
import { Layout } from '@components';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
