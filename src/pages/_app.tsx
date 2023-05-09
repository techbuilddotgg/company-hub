import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppType } from 'next/app';
import { trpc } from '@utils/trpc';
import Layout from '@components/layout';
import { AppRoute } from "@constants/app-routes";

const MyApp: AppType = ({ Component, pageProps, router }) => {
  const useLayout = ![AppRoute.SIGN_IN, AppRoute.SIGN_UP].includes(router.pathname as AppRoute)

  return (
    <ClerkProvider {...pageProps}>
      {useLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : <Component {...pageProps} />}
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
