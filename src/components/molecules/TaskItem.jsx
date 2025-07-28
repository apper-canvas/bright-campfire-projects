import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import { format, isAfter, parseISO } from "date-fns";

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onUpdateTask, 
  onDeleteTask,
  disabled = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate || task.completed) return false;
    return isAfter(new Date(), parseISO(dueDate));
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    try {
      return format(parseISO(dueDate), 'MMM d, yyyy');
    } catch {
      return null;
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdateTask(task.Id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
<div className={cn(
      "flex items-start gap-4 p-4 bg-white rounded-lg border transition-all duration-200",
      task.completed && "bg-gray-50",
      isOverdue(task.dueDate) ? "border-red-200 bg-red-50/30" : "border-gray-200"
    )}>
      <button
        onClick={() => onToggleComplete(task.Id, !task.completed)}
        disabled={disabled}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 mt-0.5",
          task.completed 
            ? "bg-success-500 border-success-500 text-white" 
            : "border-gray-300 hover:border-primary-500"
        )}
      >
        {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            autoFocus
            className="text-base"
          />
        ) : (
          <div className="space-y-2">
            <span
              className={cn(
                "text-base cursor-pointer block",
                task.completed 
                  ? "text-gray-500 line-through" 
                  : "text-gray-900 hover:text-primary-700"
              )}
              onClick={() => !disabled && setIsEditing(true)}
            >
              {task.title}
            </span>
            
            <div className="flex items-center gap-3">
              {task.priority && (
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-medium", getPriorityColor(task.priority))}
                >
                  {getPriorityLabel(task.priority)}
                </Badge>
              )}
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue(task.dueDate) 
                    ? "text-red-600 font-medium" 
                    : task.completed 
                      ? "text-gray-400" 
                      : "text-gray-500"
                )}>
                  <ApperIcon 
                    name={isOverdue(task.dueDate) ? "AlertCircle" : "Calendar"} 
                    className="w-3 h-3" 
                  />
                  {formatDueDate(task.dueDate)}
                  {isOverdue(task.dueDate) && !task.completed && (
                    <span className="ml-1 text-red-600 font-medium">Overdue</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveEdit}
              disabled={disabled}
            >
              <ApperIcon name="Check" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelEdit}
              disabled={disabled}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={disabled}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTask(task.Id)}
              disabled={disabled}
            >
              <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;