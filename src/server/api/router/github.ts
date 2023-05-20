import { protectedProcedure, t } from '../trpc';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { GithubRepository } from '../../../shared/types/github.types';
import { z } from 'zod';

export const githubRouter = t.router({
  getRepositories: protectedProcedure.query(
    async ({ ctx: { authedUserId } }) => {
      try {
        const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
          authedUserId,
          'oauth_github',
        );
        console.log(tokenResponse[0]?.token);
        const repositoriesResponse = await fetch(
          'https://api.github.com/user/repos',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse[0]?.token}`,
            },
          },
        );
        const repositories: GithubRepository[] =
          await repositoriesResponse.json();
        return repositories
          .sort(
            (repo1, repo2) =>
              new Date(repo1.updated_at).getTime() -
              new Date(repo2.updated_at).getTime(),
          )
          .map((repo) => {
            return {
              ...repo,
            };
          });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  ),
  addWebhook: protectedProcedure
    .input(
      z.object({
        boardId: z.string(),
        repositoryName: z.string(),
        repositoryOwner: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { prisma, authedUserId } }) => {
      try {
        const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
          authedUserId,
          'oauth_github',
        );
        await fetch(
          `https://api.github.com/repos/${input.repositoryOwner}/${input.repositoryName}/hooks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenResponse[0]?.token}`,
            },
            body: JSON.stringify({
              name: 'web',
              active: true,
              events: ['pull_request'],
              config: {
                url: `${process.env.GITHUB_WEBHOOK_LISTENER_URL}/merge`,
                content_type: 'json',
                insecure_ssl: '0',
                secret: process.env.GITHUB_WEBHOOK_SECRET,
              },
            }),
          },
        );
        await fetch(
          `https://api.github.com/repos/${input.repositoryOwner}/${input.repositoryName}/hooks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenResponse[0]?.token}`,
            },
            body: JSON.stringify({
              name: 'web',
              active: true,
              events: ['create'],
              config: {
                url: `${process.env.GITHUB_WEBHOOK_LISTENER_URL}/create`,
                content_type: 'json',
                insecure_ssl: '0',
                secret: process.env.GITHUB_WEBHOOK_SECRET,
              },
            }),
          },
        );

        await prisma.githubData.create({
          data: {
            projectBoardId: input.boardId,
            repository: input.repositoryName,
            owner: input.repositoryOwner,
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
