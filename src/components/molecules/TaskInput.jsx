import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskInput = ({ onAddTask, disabled = false }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          disabled={disabled}
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        disabled={disabled || !taskTitle.trim()}
        variant="primary"
      >
        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};

export default TaskInput;