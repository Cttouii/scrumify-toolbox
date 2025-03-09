
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { Task } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import { Plus } from "lucide-react";
import NewTaskForm from "@/components/tasks/NewTaskForm";
import { toast } from "sonner";

const ProductBacklog: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, getProject } = useProjects();
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const project = getProject(projectId || "");
  
  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks.filter(task => 
        task.sprintId === "backlog" && task.status === "backlog"
      );
      setBacklogTasks(filtered);
    }
  }, [tasks]);
  
  const handleAddTask = () => {
    setShowNewTaskForm(true);
    setEditingTask(null);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowNewTaskForm(true);
  };
  
  const handleCloseForm = () => {
    setShowNewTaskForm(false);
    setEditingTask(null);
  };
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Backlog</h1>
          <p className="text-scrum-text-secondary">
            Add tasks to the backlog that are not yet assigned to a sprint
          </p>
        </div>
        
        <button 
          onClick={handleAddTask}
          className="scrum-button flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>
      
      {showNewTaskForm ? (
        <div className="bg-scrum-card border border-scrum-border rounded-lg p-4 mb-6">
          <NewTaskForm 
            sprintId="backlog"
            initialStatus="backlog"
            onClose={handleCloseForm}
            editTask={editingTask}
          />
        </div>
      ) : null}
      
      {backlogTasks.length === 0 ? (
        <div className="bg-scrum-card border border-scrum-border rounded-lg p-8 text-center">
          <p className="text-scrum-text-secondary mb-4">
            No tasks in the backlog yet
          </p>
          <button 
            onClick={handleAddTask}
            className="scrum-button-secondary"
          >
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {backlogTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => handleEditTask(task)}
              className="cursor-pointer"
            >
              <TaskCard 
                task={task} 
                onEdit={() => handleEditTask(task)} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBacklog;
