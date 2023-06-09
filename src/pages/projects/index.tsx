import React, { useEffect } from 'react';
import { trpc } from '@utils/trpc';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialogButton,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  LoaderButton,
  PageHeader,
} from '@components';
import { Project } from '@prisma/client';
import SaveProjectForm from '@components/pages/project/save-project-form';
import { ProjectWithBoards } from '@shared/types/project.types';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';

const Projects = () => {
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [selectedProjectForEditing, setSelectedProjectForEditing] =
    React.useState<ProjectWithBoards>();
  const { user } = useUser();

  const { data: projects, refetch: refetchProjects } =
    trpc.project.get.useQuery();

  const { mutate: updateProjectMutation, isLoading: isUpdateProjectLoading } =
    trpc.project.update.useMutation({
      onSuccess: () => refetchProjects(),
    });
  const { mutate: deleteProjectMutation, isLoading: isDeleteProjectLoading } =
    trpc.project.delete.useMutation({
      onSuccess: () => refetchProjects(),
    });

  const setProjectStatus = (project: Project) => {
    if (project.endDate) updateProjectMutation({ ...project, endDate: null });
    else updateProjectMutation({ ...project, endDate: new Date() });
  };

  const deleteProject = (id: string) => {
    deleteProjectMutation(id);
  };

  useEffect(() => {
    if (selectedProjectForEditing) setDialogOpened(true);
  }, [selectedProjectForEditing]);

  useEffect(() => {
    if (!dialogOpened) setSelectedProjectForEditing(undefined);
  }, [dialogOpened]);

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <Dialog open={dialogOpened}>
        <div className="mb-10 flex flex-row justify-between">
          <PageHeader
            title="Projects"
            classNameContainer="flex-row justify-between"
            rightHelper={
              <>
                {user?.publicMetadata.isAdmin && (
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setSelectedProjectForEditing(undefined);
                      setDialogOpened(true);
                    }}
                  >
                    <Button className="self-end">Add new project</Button>
                  </DialogTrigger>
                )}
              </>
            }
          />
        </div>
        {projects?.length === 0 && <p>No projects found.</p>}
        {projects?.map((project) => (
          <Accordion key={project.id} type="single" collapsible>
            <AccordionItem value={project.id}>
              <AccordionTrigger>{project.name}</AccordionTrigger>
              <AccordionContent>
                <p className="font-bold">{project.description}</p>
                <div className="mt-6 flex flex-col justify-between md:flex-row">
                  <div className="flex flex-row">
                    <div>
                      <p className="font-bold">Start Date</p>
                      <p>{format(project.startDate, 'PPP')}</p>
                    </div>
                    <div className="ml-10">
                      <p className="font-bold">End Date</p>
                      <p>
                        {project.endDate
                          ? format(project.endDate, 'PPP')
                          : 'Project not closed yet'}
                      </p>
                    </div>
                  </div>
                  <>
                    {user?.publicMetadata.isAdmin && (
                      <div className="mt-5 flex flex-row items-center md:mt-0">
                        <LoaderButton
                          isLoading={isUpdateProjectLoading}
                          onClick={() => setProjectStatus(project)}
                          variant="secondary"
                        >
                          {project.endDate ? 'Reopen project' : 'Close project'}
                        </LoaderButton>
                        <Button
                          className="ml-2"
                          onClick={() => setSelectedProjectForEditing(project)}
                        >
                          Edit
                        </Button>
                        <AlertDialogButton
                          handleAction={() => deleteProject(project.id)}
                          buttonVariant={'outline'}
                          buttonClassName={'ml-2'}
                          buttonText={'Delete'}
                          title={'Delete project'}
                          description={
                            'Are you sure you want to delete this project?'
                          }
                          isActionLoading={isDeleteProjectLoading}
                        />
                      </div>
                    )}
                  </>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        <DialogContent setDialogOpen={setDialogOpened}>
          <SaveProjectForm
            project={selectedProjectForEditing}
            setDialogOpened={setDialogOpened}
            refetchProjects={refetchProjects}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Projects;
