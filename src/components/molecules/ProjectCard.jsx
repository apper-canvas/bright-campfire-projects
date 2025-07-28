import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

const ProjectCard = ({ project, taskCount = 0, completedCount = 0, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/projects/${project.Id}`);
  };

  const completionPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div 
      className="card cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
      onClick={handleCardClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-150">
            {project.name}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
            >
              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <ApperIcon name="CheckSquare" className="w-4 h-4" />
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </span>
          </div>

          {taskCount > 0 && (
            <Badge variant={completionPercentage === 100 ? "success" : "primary"}>
              {completionPercentage}% complete
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;