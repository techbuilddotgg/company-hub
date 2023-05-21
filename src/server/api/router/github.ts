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
        await prisma.$transaction(async (tx) => {
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

          const githubData = await tx.githubData.create({
            data: {
              projectBoardId: input.boardId,
              repository: input.repositoryName,
              owner: input.repositoryOwner,
            },
          });

          await tx.githubWebhookAction.create({
            data: {
              githubDataId: githubData.id,
              actionType: 'CREATE',
              projectBoardColumnName: 'Doing',
            },
          });

          await tx.githubWebhookAction.create({
            data: {
              githubDataId: githubData.id,
              actionType: 'PULL_REQUEST',
              projectBoardColumnName: 'Done',
            },
          });

          const columns = [
            { name: 'To do', orderIndex: 0 },
            { name: 'Doing', orderIndex: 1 },
            { name: 'Done', orderIndex: 2 },
          ];
          for (const column of columns) {
            const columnFromDB = await tx.projectBoardColumn.findFirst({
              where: {
                AND: [{ name: column.name, projectBoardId: input.boardId }],
              },
            });

            if (!columnFromDB) {
              await prisma.projectBoard.update({
                where: { id: input.boardId },
                data: {
                  projectBoardColumns: {
                    updateMany: {
                      where: {
                        orderIndex: {
                          gte: column.orderIndex,
                        },
                      },
                      data: {
                        orderIndex: {
                          increment: 1,
                        },
                      },
                    },
                  },
                },
              });
              await tx.projectBoardColumn.create({
                data: {
                  name: column.name,
                  orderIndex: column.orderIndex,
                  projectBoardId: input.boardId,
                },
              });
            }
          }
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          message: 'Something went wrong. Please try again later.',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
  isIntegrated: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx: { prisma } }) => {
      const data = await prisma.githubData.findFirst({
        where: {
          projectBoardId: input.boardId,
        },
      });
      return !!data;
    }),
  removeWebhooks: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .mutation(async ({ input, ctx: { prisma, authedUserId } }) => {
      await prisma.$transaction(async (tx) => {
        const githubDataToDelete = await tx.githubData.findMany({
          where: {
            projectBoardId: input.boardId,
          },
        });
        await tx.githubData.deleteMany({
          where: {
            projectBoardId: input.boardId,
          },
        });
        const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
          authedUserId,
          'oauth_github',
        );
        for (const githubData of githubDataToDelete) {
          const hooksResponse = await fetch(
            `https://api.github.com/repos/${githubData.owner}/${githubData.repository}/hooks`,
            {
              headers: {
                Authorization: `Bearer ${tokenResponse[0]?.token}`,
              },
            },
          );
          const hooks = await hooksResponse.json();
          for (const hook of hooks) {
            await fetch(
              `https://api.github.com/repos/${githubData.owner}/${githubData.repository}/hooks/${hook.id}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${tokenResponse[0]?.token}`,
                },
              },
            );
          }
        }
      });
    }),
  getWebhookActions: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(async ({ input, ctx: { prisma } }) => {
      return await prisma.githubData.findFirst({
        where: {
          projectBoardId: input.boardId,
        },
        select: {
          githubWebhooks: true,
        },
      });
    }),
  updateWebhookAction: protectedProcedure
    .input(z.object({ projectBoardColumnName: z.string(), id: z.string() }))
    .mutation(async ({ input, ctx: { prisma } }) => {
      await prisma.githubWebhookAction.update({
        where: {
          id: input.id,
        },
        data: {
          projectBoardColumnName: input.projectBoardColumnName,
        },
      });
    }),
});
