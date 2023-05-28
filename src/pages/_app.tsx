import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppType } from 'next/app';
import { trpc } from '@utils/trpc';
import { AppRoute } from '@constants/app-routes';
import { Layout, Toaster } from '@components';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { toast } from '@hooks';
import { TRPCClientError } from '@trpc/client';
import { TRPCResponse } from '@shared/types/common.types';

const mutationCache = new MutationCache({
  onSuccess: (data) => {
    const typedData = data as TRPCResponse;
    if (typedData.message) {
      toast({
        title: typedData.message.title,
        description: typedData.message.description,
      });
    }
  },
  onError: (error, _variables, _context, mutation) => {
    if (mutation.options.onError) return;

    const message =
      error instanceof TRPCClientError
        ? error.message
        : 'Something went wrong, please try again later.';
    toast({
      variant: 'destructive',
      title: message,
    });
  },
});

const queryClient = new QueryClient({ mutationCache });

const MyApp: AppType = ({ Component, pageProps, router }) => {
  const useLayout = ![AppRoute.SIGN_IN, AppRoute.SIGN_UP].includes(
    router.pathname as AppRoute,
  );

  return (
    <ClerkProvider {...pageProps}>
      <QueryClientProvider client={queryClient}>
        {useLayout ? (
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
