import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import teamMemberService from "@/services/api/teamMemberService";
const TaskInput = ({ onAddTask, disabled = false, projectTeamMembers = [] }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        if (projectTeamMembers.length > 0) {
          const members = await teamMemberService.getByIds(projectTeamMembers);
          setTeamMembers(members);
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
      }
    };
    loadTeamMembers();
  }, [projectTeamMembers]);

const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      const taskData = {
        title: taskTitle.trim(),
        priority,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null
      };
      onAddTask(taskData);
      setTaskTitle("");
      setPriority("medium");
      setDueDate("");
      setAssignedTo("");
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
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.Id} value={member.Id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
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