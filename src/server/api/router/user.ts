import { protectedProcedure, t } from "../trpc";
import { z } from 'zod';
import {clerkClient} from "@clerk/nextjs/server";

export const userRouter = t.router({
  invite: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await clerkClient.invitations.createInvitation({emailAddress: input.email, redirectUrl: 'http://localhost:3000/signup'})
        const allowListResponse = await clerkClient.allowlistIdentifiers.createAllowlistIdentifier({identifier: input.email, notify: true})

        return {message: 'Invitation sent to ' + allowListResponse.identifier}
      }
      catch (error) {
        return {message: 'Something went wrong. Please try again.'}
      }
    }),
});