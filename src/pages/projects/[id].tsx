import { Board, DataView } from '@components';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';
import { Project, ProjectBoard } from '@prisma/client';
import React from 'react';
import GithubIntegrationDialog from '@components/pages/project/github-integration-dialog';

const Project = () => {
  const router = useRouter();
  const { data: project, isLoading } = trpc.project.getById.useQuery({
    id: router.query.id as string,
  });

  return (
    <DataView<Project & { projectBoards: ProjectBoard[] }>
      loading={isLoading}
      data={project}
      fallback={<div>Project not found</div>}
    >
      {(data) => (
        <div className="ml-10">
          <div className="flex flex-row justify-between">
            <h1 className="my-4 text-2xl font-bold">{data.name}</h1>
            <GithubIntegrationDialog
              boardId={data.projectBoards[0]?.id || ''}
            />
          </div>
          {data.projectBoards.length !== 0 && data.projectBoards[0] ? (
            <Board data={data.projectBoards[0]} />
          ) : (
            <p>No project board</p>
          )}
        </div>
      )}
    </DataView>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) return { notFound: true };
  resetServerContext();

  return { props: { data: [] } };
};
