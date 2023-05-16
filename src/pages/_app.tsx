import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppType } from 'next/app';
import { trpc } from '@utils/trpc';
import { AppRoute } from '@constants/app-routes';
import { Layout, Toaster } from '@components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps, router }) => {
  const useLayout = ![AppRoute.SIGN_IN, AppRoute.SIGN_UP].includes(
    router.pathname as AppRoute,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider {...pageProps}>
        {useLayout ? (
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
