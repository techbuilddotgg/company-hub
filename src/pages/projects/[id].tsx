import { Board, DataView } from '@components';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';

import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@server/api/router';

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProjectWithBoard = RouterOutput['project']['getById'];

const Project = () => {
  const router = useRouter();
  const {
    data: project,
    isLoading,
    isError,
  } = trpc.project.getById.useQuery({
    id: router.query.id as string,
  });

  return (
    <DataView<ProjectWithBoard>
      isLoading={isLoading}
      isError={isError}
      data={project}
      fallback={<div>Project not found</div>}
    >
      {(data) => (
        <div className="ml-10">
          <h1 className="my-4 text-2xl font-bold">{data.name}</h1>
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
