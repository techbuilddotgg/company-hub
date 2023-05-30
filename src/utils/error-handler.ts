import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { TRPCError } from '@trpc/server';
import { ClerkAPIError } from '@clerk/types';

type ClerkError = {
  clerkError: boolean;
  status: number;
  errors: ClerkAPIError[];
};
function isClerkError(error: any): error is ClerkError {
  if (!error) return false;
  if (!error.errors) return false;
  if (error.errors.length === 0) return false;
  return (error as ClerkError).errors[0]?.code !== undefined;
}
export const errorHandler = <T extends any[], R>(
  executable: (...args: T) => Promise<R>,
): ((...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R> => {
    try {
      return await executable(...args);
    } catch (error) {
      const response = {
        message: 'Something went wrong. Please try again later.',
        code: 'INTERNAL_SERVER_ERROR',
      } as { message: string; code: TRPC_ERROR_CODE_KEY };

      if (isClerkError(error)) {
        response.message = error.errors[0]?.message || response.message;
      }

      if (error instanceof TRPCError) {
        response.message = error.message;
        response.code = error.code;
      }
      throw new TRPCError(response);
    }
  };
};
