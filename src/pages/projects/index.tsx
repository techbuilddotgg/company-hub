import React, { useEffect } from 'react';
import { trpc } from '@utils/trpc';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@components';
import { formatDate } from '@utils/format-date';
import { Project } from '@prisma/client';
import SaveProjectForm from '@components/pages/project/save-project-form';
import { ProjectWithBoards } from '../../shared/types/project.types';

const Projects = () => {
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [selectedProjectForEditing, setSelectedProjectForEditing] =
    React.useState<ProjectWithBoards>();

  const { data: projects, refetch: refetchProjects } =
    trpc.project.get.useQuery();

  const { mutate: updateProjectMutation } = trpc.project.update.useMutation({
    onSuccess: () => refetchProjects(),
  });
  const { mutate: deleteProjectMutation } = trpc.project.delete.useMutation({
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
    <Dialog open={dialogOpened}>
      <div className="flex flex-row justify-between">
        <h1 className="mb-10 text-3xl font-bold">Projects</h1>
        <DialogTrigger
          asChild
          onClick={() => {
            setSelectedProjectForEditing(undefined);
            setDialogOpened(true);
          }}
        >
          <Button className="mt-4">Add new project</Button>
        </DialogTrigger>
      </div>
      {projects?.map((project) => (
        <Accordion key={project.id} type="single" collapsible>
          <AccordionItem value={project.id}>
            <AccordionTrigger>{project.name}</AccordionTrigger>
            <AccordionContent>
              <p className="font-bold">{project.description}</p>
              <div className="mt-6 flex flex-row justify-between">
                <div className="flex flex-row">
                  <div>
                    <p>Start Date</p>
                    <p>{formatDate(project.startDate)}</p>
                  </div>
                  <div className="ml-10">
                    <p>End Date</p>
                    <p>
                      {project.endDate
                        ? formatDate(project.endDate)
                        : 'Project not closed yet'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <Button
                    onClick={() => setProjectStatus(project)}
                    variant="outline"
                  >
                    {project.endDate ? 'Reopen project' : 'Close project'}
                  </Button>
                  <Button
                    className="ml-2"
                    onClick={() => setSelectedProjectForEditing(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteProject(project.id)}
                    className="ml-2"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
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
  );
};

export default Projects;
