import { Board, DataView, PageHeader } from '@components';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';

import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@server/api/router';
import GithubIntegrationDialog from '@components/pages/project/github-integration-dialog';
import React from 'react';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProjectWithBoard = RouterOutput['project']['getById'];

const Project = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data: project, isLoading } = trpc.project.getById.useQuery(
    {
      id: router.query.id as string,
    },
    { enabled: !!router.query.id },
  );

  return (
    <>
      <Head>
        <title>{project?.name}</title>
      </Head>
      <DataView<ProjectWithBoard>
        isLoading={isLoading}
        data={project}
        fallback={<div>Project not found</div>}
      >
        {(data) => (
          <div>
            <PageHeader
              className="mb-10"
              title={data.name}
              classNameContainer="justify-between flex-row"
              rightHelper={
                <>
                  {user?.publicMetadata.isAdmin &&
                    data.projectBoards.length !== 0 &&
                    data.projectBoards[0] && (
                      <GithubIntegrationDialog
                        boardId={data.projectBoards[0].id}
                      />
                    )}
                </>
              }
            />
            {data.projectBoards.length !== 0 && data.projectBoards[0] ? (
              <Board data={data.projectBoards[0]} />
            ) : (
              <p>No project board</p>
            )}
          </div>
        )}
      </DataView>
    </>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) return { notFound: true };
  resetServerContext();

  return { props: { data: [] } };
};
