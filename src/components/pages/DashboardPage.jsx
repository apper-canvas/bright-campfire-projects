import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ProjectModal from "@/components/organisms/ProjectModal";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import { formatDistanceToNow } from "date-fns";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    project: null,
    loading: false
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      setAllTasks(tasksData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateProject = () => {
    setModalState({
      isOpen: true,
      project: null,
      loading: false
    });
  };

  const handleSaveProject = async (formData) => {
    try {
      setModalState(prev => ({ ...prev, loading: true }));
      await projectService.create(formData);
      toast.success("Project created successfully!");
      setModalState({ isOpen: false, project: null, loading: false });
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to create project");
      setModalState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!modalState.loading) {
      setModalState({ isOpen: false, project: null, loading: false });
    }
  };

  // Calculate project statistics
  const getProjectStats = (projectId) => {
    const projectTasks = allTasks.filter(task => task.projectId === projectId);
    const completed = projectTasks.filter(task => task.completed).length;
    const total = projectTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  // Get recent activity (last 10 task updates)
const getRecentActivity = () => {
    const recentTasks = [...allTasks]
      .filter(task => task.completedAt || task.createdAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.createdAt);
        const dateB = new Date(b.completedAt || b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 8);

    return recentTasks.map(task => {
      const project = projects.find(p => p.Id === task.projectId);
      return {
        ...task,
        projectName: project?.name || 'Unknown Project'
      };
    });
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return allTasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).map(task => {
      const project = projects.find(p => p.Id === task.projectId);
      return {
        ...task,
        projectName: project?.name || 'Unknown Project'
      };
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  if (projects.length === 0) {
    return <Empty type="projects" onAction={handleCreateProject} />;
  }

  const recentActivity = getRecentActivity();
  const overdueTasks = getOverdueTasks();

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Your project overview and recent activity
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/projects')}>
                <ApperIcon name="FolderOpen" className="w-4 h-4 mr-2" />
                All Projects
              </Button>
              <Button variant="primary" onClick={handleCreateProject}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ApperIcon name="FolderOpen" className="w-8 h-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ApperIcon name="CheckSquare" className="w-8 h-8 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{allTasks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ApperIcon name="Clock" className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{overdueTasks.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ApperIcon name="TrendingUp" className="w-8 h-8 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {allTasks.filter(task => task.completed).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Projects Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Projects Overview</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/projects')}
                  >
                    View All
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.slice(0, 5).map(project => {
                    const stats = getProjectStats(project.Id);
                    return (
                      <div 
                        key={project.Id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => navigate(`/projects/${project.Id}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {project.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {stats.completed} of {stats.total} tasks completed
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {stats.percentage}%
                            </p>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map(task => (
                      <div key={task.Id} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          task.completed ? 'bg-success-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>
                              {task.title}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {task.projectName} • {formatDistanceToNow(new Date(task.completedAt || task.createdAt))} ago
                          </p>
                        </div>
                        {task.completed && (
                          <ApperIcon name="CheckCircle" className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-red-200">
              <div className="p-6 border-b border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-red-900">
                    Overdue Tasks ({overdueTasks.length})
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map(task => (
                    <div 
                      key={task.Id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => navigate(`/projects/${task.projectId}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.projectName} • Due {formatDistanceToNow(new Date(task.dueDate))} ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </Badge>
                        <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                  {overdueTasks.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      And {overdueTasks.length - 5} more overdue tasks
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        project={modalState.project}
        loading={modalState.loading}
      />
    </>
  );
};

export default DashboardPage;