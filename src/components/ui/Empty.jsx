import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  type = "default",
  title,
  description,
  actionLabel,
  onAction,
  icon = "FileText"
}) => {
  const emptyStates = {
    projects: {
      title: "No projects yet",
      description: "Get started by creating your first project. Organize your work and keep track of tasks in one place.",
      actionLabel: "Create your first project",
      icon: "FolderPlus"
    },
    tasks: {
      title: "No tasks yet",
      description: "Add tasks to keep track of what needs to be done in this project.",
      actionLabel: "Add your first task",
      icon: "Plus"
    },
    default: {
      title: title || "No items found",
      description: description || "There are no items to display at the moment.",
      actionLabel: actionLabel || "Add item",
      icon: icon
    }
  };

  const state = emptyStates[type] || emptyStates.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        <ApperIcon name={state.icon} className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{state.title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {state.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {state.actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;