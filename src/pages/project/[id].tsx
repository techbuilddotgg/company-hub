import { Board } from '@components';
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
  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="ml-10">
      <h1 className="my-4 text-2xl font-bold">{project.name}</h1>
      <AddProjectForm />
      {project.ProjectBoard.length !== 0 && project.ProjectBoard[0] ? (
        <Board data={project.ProjectBoard[0]} />
      ) : (
        <p>No project board</p>
      )}
    </div>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) return { notFound: true };
  resetServerContext();

  return { props: { data: [] } };
};
