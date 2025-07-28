import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProjectCard from "@/components/molecules/ProjectCard";
import ProjectModal from "@/components/organisms/ProjectModal";
import DeleteConfirmModal from "@/components/organisms/DeleteConfirmModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    project: null,
    loading: false
  });
  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    project: null,
    loading: false
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      
      // Calculate task counts for each project
      const counts = {};
      projectsData.forEach(project => {
        const projectTasks = tasksData.filter(task => task.projectId === project.Id);
        counts[project.Id] = {
          total: projectTasks.length,
          completed: projectTasks.filter(task => task.completed).length
        };
      });
      setTaskCounts(counts);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = () => {
    setModalState({
      isOpen: true,
      project: null,
      loading: false
    });
  };

  const handleEditProject = (project) => {
    setModalState({
      isOpen: true,
      project,
      loading: false
    });
  };

  const handleSaveProject = async (formData) => {
    try {
      setModalState(prev => ({ ...prev, loading: true }));
      
      if (modalState.project) {
        await projectService.update(modalState.project.Id, formData);
        toast.success("Project updated successfully!");
      } else {
        await projectService.create(formData);
        toast.success("Project created successfully!");
      }
      
      setModalState({ isOpen: false, project: null, loading: false });
      loadProjects();
    } catch (err) {
      toast.error(err.message || "Failed to save project");
      setModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteProject = (project) => {
    setDeleteState({
      isOpen: true,
      project,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteState(prev => ({ ...prev, loading: true }));
      
      // Delete all tasks in the project first
      await taskService.deleteByProjectId(deleteState.project.Id);
      
      // Then delete the project
      await projectService.delete(deleteState.project.Id);
      
      toast.success("Project deleted successfully!");
      setDeleteState({ isOpen: false, project: null, loading: false });
      loadProjects();
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
      setDeleteState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!modalState.loading) {
      setModalState({ isOpen: false, project: null, loading: false });
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteState.loading) {
      setDeleteState({ isOpen: false, project: null, loading: false });
    }
  };

  if (loading) {
    return <Loading type="projects" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }

  if (projects.length === 0) {
    return <Empty type="projects" onAction={handleCreateProject} />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Organize your work and track progress across all your projects.
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateProject}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.Id}
              project={project}
              taskCount={taskCounts[project.Id]?.total || 0}
              completedCount={taskCounts[project.Id]?.completed || 0}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={modalState.project}
        loading={modalState.loading}
      />

      <DeleteConfirmModal
        isOpen={deleteState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? All tasks within this project will also be deleted. This action cannot be undone."
        loading={deleteState.loading}
      />
    </>
  );
};

export default ProjectsList;