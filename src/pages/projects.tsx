import { Board } from '@components';
import { GetServerSideProps } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';

const Projects = () => {
  return (
    <div className="ml-10">
      <h1 className="my-4 text-2xl font-bold">Project 1</h1>
      <Board />
    </div>
  );
};

export default Projects;

export const getServerSideProps: GetServerSideProps = async () => {
  resetServerContext();

  return { props: { data: [] } };
};
