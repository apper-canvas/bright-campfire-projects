import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.tasks];
  }

  async getByProjectId(projectId) {
    await this.delay(200);
    return this.tasks.filter(task => task.projectId === parseInt(projectId));
  }

  async getById(id) {
    await this.delay(150);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

async create(taskData) {
    await this.delay(300);
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      projectId: parseInt(taskData.projectId),
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      assignedTo: taskData.assignedTo ? parseInt(taskData.assignedTo) : null,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }
async update(id, taskData) {
    await this.delay(200);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData
    };

    // Handle completion status
    if (taskData.completed !== undefined) {
      updatedTask.completedAt = taskData.completed ? new Date().toISOString() : null;
    }

// Ensure priority, dueDate and assignedTo are preserved if not provided
    if (taskData.priority !== undefined) {
      updatedTask.priority = taskData.priority;
    }
    if (taskData.dueDate !== undefined) {
      updatedTask.dueDate = taskData.dueDate;
    }
    if (taskData.assignedTo !== undefined) {
      updatedTask.assignedTo = taskData.assignedTo ? parseInt(taskData.assignedTo) : null;
    }
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    return true;
  }

  async deleteByProjectId(projectId) {
    await this.delay(250);
    this.tasks = this.tasks.filter(task => task.projectId !== parseInt(projectId));
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TaskService();