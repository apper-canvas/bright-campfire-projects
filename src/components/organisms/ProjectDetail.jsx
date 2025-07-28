import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TaskInput from "@/components/molecules/TaskInput";
import TaskItem from "@/components/molecules/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("created");
  const [filterBy, setFilterBy] = useState("all");
  const loadProjectAndTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(id),
        taskService.getByProjectId(id)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      if (err.message === "Project not found") {
        navigate("/");
        toast.error("Project not found");
        return;
      }
      setError(err.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectAndTasks();
  }, [id]);

const handleAddTask = async (taskData) => {
    try {
      setTasksLoading(true);
      const newTask = await taskService.create({
        projectId: id,
        title: typeof taskData === 'string' ? taskData : taskData.title,
        priority: typeof taskData === 'object' ? taskData.priority : 'medium',
        dueDate: typeof taskData === 'object' ? taskData.dueDate : null
      });
      setTasks(prev => [...prev, newTask]);
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add task");
    } finally {
      setTasksLoading(false);
    }
  };

  const sortTasks = (tasks, sortBy) => {
    const sorted = [...tasks];
    switch (sortBy) {
      case "dueDate":
        return sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => {
          const aPriority = priorityOrder[a.priority] ?? 1;
          const bPriority = priorityOrder[b.priority] ?? 1;
          return aPriority - bPriority;
        });
      case "completed":
        return sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      case "created":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filterTasks = (tasks, filterBy) => {
    switch (filterBy) {
      case "completed":
        return tasks.filter(task => task.completed);
      case "pending":
        return tasks.filter(task => !task.completed);
      case "all":
      default:
        return tasks;
    }
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks, filterBy), sortBy);

  const handleToggleTask = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(completed ? "Task completed!" : "Task marked as incomplete");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading type="project-header" />
        <Loading type="tasks" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadProjectAndTasks} />;
  }

  if (!project) {
    return <Error message="Project not found" showRetry={false} />;
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="CheckSquare" className="w-5 h-5" />
            <span className="font-medium">{totalTasks}</span>
            <span>{totalTasks === 1 ? "task" : "tasks"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Clock" className="w-5 h-5" />
            <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
          </div>

          {totalTasks > 0 && (
            <Badge variant={completionPercentage === 100 ? "success" : "primary"} size="md">
              {completionPercentage}% complete ({completedTasks}/{totalTasks})
            </Badge>
          )}
        </div>
      </div>

      {/* Tasks Section */}
<div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          {totalTasks > 0 && (
            <div className="text-sm text-gray-500">
              {completedTasks} of {totalTasks} completed
            </div>
          )}
        </div>

        {/* Task Controls */}
        {totalTasks > 0 && (
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex gap-1">
                {[
                  { value: "created", label: "Created", icon: "Clock" },
                  { value: "dueDate", label: "Due Date", icon: "Calendar" },
                  { value: "priority", label: "Priority", icon: "Flag" },
                  { value: "completed", label: "Status", icon: "CheckSquare" }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                    className="text-xs"
                  >
                    <ApperIcon name={option.icon} className="w-3 h-3 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-1">
                {[
                  { value: "all", label: "All", count: tasks.length },
                  { value: "pending", label: "Pending", count: tasks.filter(t => !t.completed).length },
                  { value: "completed", label: "Completed", count: completedTasks }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filterBy === option.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterBy(option.value)}
                    className="text-xs"
                  >
                    {option.label}
                    <Badge variant="secondary" className="ml-1 text-xs bg-white/20">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <TaskInput onAddTask={handleAddTask} disabled={tasksLoading} />

        {tasksLoading ? (
          <Loading type="tasks" />
        ) : tasks.length === 0 ? (
          <Empty 
            type="tasks" 
            onAction={() => document.querySelector('input[placeholder="Add a new task..."]')?.focus()}
          />
        ) : (
<div className="space-y-3">
            {filteredAndSortedTasks.map(task => (
              <TaskItem
                key={task.Id}
                task={task}
                onToggleComplete={handleToggleTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;