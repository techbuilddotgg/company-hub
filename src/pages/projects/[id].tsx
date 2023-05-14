import { Board, LoadingProvider } from '@components';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';
import AddProjectForm from '@components/pages/project/add-project-form';

const Project = () => {
  const router = useRouter();
  const { data: project, isLoading } = trpc.project.getById.useQuery({
    id: router.query.id as string,
  });
  console.log(project);

  if (!project) return <div>Project not found</div>;

  return (
    <LoadingProvider loading={isLoading}>
      <div className="ml-10">
        <h1 className="my-4 text-2xl font-bold">{project.name}</h1>
        <AddProjectForm />
        {project.projectBoards.length !== 0 && project.projectBoards[0] ? (
          <Board data={project.projectBoards[0]} />
        ) : (
          <p>No project board</p>
        )}
      </div>
    </LoadingProvider>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) return { notFound: true };
  resetServerContext();

  return { props: { data: [] } };
};
