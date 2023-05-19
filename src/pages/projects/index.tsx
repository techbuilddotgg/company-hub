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
import { Project } from '@prisma/client';
import SaveProjectForm from '@components/pages/project/save-project-form';
import { ProjectWithBoards } from '../../shared/types/project.types';
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

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
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteProject(project.id)}
                    className="ml-2"
                    variant="ghost"
                  >
                    <Trash2 color="black" size={22} />
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
