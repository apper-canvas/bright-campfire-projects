import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";

const TaskInput = ({ onAddTask, disabled = false }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      const taskData = {
        title: taskTitle.trim(),
        priority,
        dueDate: dueDate || null
      };
      onAddTask(taskData);
      setTaskTitle("");
      setPriority("medium");
      setDueDate("");
      setShowAdvanced(false);
    }
  };

  const priorityOptions = [
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" }
  ];

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
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
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={disabled}
            className="px-3"
          >
            <ApperIcon name={showAdvanced ? "ChevronUp" : "Settings"} className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            disabled={disabled || !taskTitle.trim()}
            variant="primary"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {showAdvanced && (
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value)}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      priority === option.value
                        ? option.color + " ring-2 ring-offset-1 ring-gray-300"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                value={formatDateForInput(dueDate)}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value).toISOString() : "")}
                disabled={disabled}
                className="w-full"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskInput;