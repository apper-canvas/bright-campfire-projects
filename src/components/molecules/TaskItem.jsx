import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onUpdateTask, 
  onDeleteTask,
  disabled = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

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
      "flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-200",
      task.completed && "bg-gray-50"
    )}>
      <button
        onClick={() => onToggleComplete(task.Id, !task.completed)}
        disabled={disabled}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150",
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
          <span
            className={cn(
              "text-base cursor-pointer",
              task.completed 
                ? "text-gray-500 line-through" 
                : "text-gray-900 hover:text-primary-700"
            )}
            onClick={() => !disabled && setIsEditing(true)}
          >
            {task.title}
          </span>
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