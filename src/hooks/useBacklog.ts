
import { useState, useEffect } from 'react';
import { useProjects } from '@/context/ProjectContext';
import { Task, Sprint } from '@/types';
import { toast } from 'sonner';

export function useBacklog(projectId: string | undefined) {
  const { 
    getProject, 
    getSprintsByProject,
    tasks,
    updateTask,
    deleteTask
  } = useProjects();
  
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  
  const project = projectId ? getProject(projectId) : undefined;
  const availableSprints = projectId ? 
    getSprintsByProject(projectId).filter(s => s.status !== "completed") : [];
  
  // Filter backlog tasks (those with sprintId="backlog")
  useEffect(() => {
    if (!projectId) return;
    
    const backlogItems = tasks.filter(t => 
      t.sprintId === "backlog" || 
      (t.status === "backlog" && t.sprintId === projectId)
    );
    setBacklogTasks(backlogItems);
  }, [tasks, projectId]);
  
  const handleMoveToSprint = async (taskId: string, sprintId: string) => {
    try {
      await updateTask(taskId, {
        sprintId,
        status: "todo" // When moved to a sprint, it becomes a todo item
      });
      
      toast.success("Task moved to sprint");
      setMovingTaskId(null);
    } catch (error) {
      console.error("Error moving task to sprint:", error);
      toast.error("Failed to move task");
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        toast.success("Task deleted");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };
  
  return {
    project,
    backlogTasks,
    availableSprints,
    movingTaskId,
    setMovingTaskId,
    handleMoveToSprint,
    handleDeleteTask
  };
}
