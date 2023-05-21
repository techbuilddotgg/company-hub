import { GighubWebhookActionType } from '@prisma/client';

export const githubEventToText: Map<GighubWebhookActionType, string> = new Map([
  [GighubWebhookActionType.CREATE, 'CREATE BRANCH'],
  [GighubWebhookActionType.PULL_REQUEST, 'PULL REQUEST'],
]);
