
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { formatTaskFromSupabase } from "@/utils/formatUtils";

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  getTask: (id: string) => Task | undefined;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTasksBySprint: (sprintId: string) => Task[];
}

const TasksContext = createContext<TasksContextType>({
  tasks: [],
  addTask: async () => ({ id: "", title: "", sprintId: "", status: "todo", createdAt: "", updatedAt: "" }),
  getTask: () => undefined,
  updateTask: async () => ({ id: "", title: "", sprintId: "", status: "todo", createdAt: "", updatedAt: "" }),
  deleteTask: async () => {},
  getTasksBySprint: () => [],
});

export const useTasks = () => useContext(TasksContext);

export const TasksProvider: React.FC<{ 
  children: React.ReactNode;
  onTaskStatusChange?: (task: Task, oldStatus: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tasks: Task[];
  getSprint: (id: string) => any;
}> = ({ children, onTaskStatusChange, setTasks, tasks, getSprint }) => {
  const { user } = useAuth();

  const fetchTasksForSprint = async (sprintId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('sprint_id', sprintId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching tasks for sprint:', error);
        return;
      }

      if (data) {
        const formattedTasks: Task[] = data.map(formatTaskFromSupabase);

        setTasks(prev => {
          const filtered = prev.filter(t => t.sprintId !== sprintId);
          return [...filtered, ...formattedTasks];
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error('User not authenticated');

    try {
      let projectId = "";
      
      // If it's not a backlog task, get the project ID from the sprint
      if (task.sprintId !== "backlog") {
        const sprint = getSprint(task.sprintId);
        if (!sprint) throw new Error('Sprint not found');
        projectId = sprint.projectId;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          description: task.description,
          status: task.status,
          assign_to: task.assignedTo,
          priority: task.priority,
          story_points: task.storyPoints,
          sprint_id: task.sprintId,
          project_id: projectId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (!data) throw new Error('Failed to create task');

      const newTask = formatTaskFromSupabase(data);
      setTasks(prev => [...prev, newTask]);
      
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const getTask = (id: string) => tasks.find((t) => t.id === id);

  const updateTask = async (id: string, task: Partial<Omit<Task, "id">>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const existingTask = tasks.find(t => t.id === id);
      if (!existingTask) throw new Error('Task not found');

      const oldStatus = existingTask.status;

      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          status: task.status,
          assign_to: task.assignedTo,
          priority: task.priority,
          story_points: task.storyPoints,
          sprint_id: task.sprintId
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedTask = {
        ...existingTask,
        ...task,
        updatedAt: new Date().toISOString(),
      };

      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      
      // Notify if task status has changed (for burndown chart)
      if (task.status && task.status !== oldStatus && onTaskStatusChange) {
        onTaskStatusChange(updatedTask, oldStatus);
      }
      
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const taskToDelete = tasks.find(t => t.id === id);
      if (!taskToDelete) throw new Error('Task not found');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getTasksBySprint = (sprintId: string) => 
    tasks.filter((t) => t.sprintId === sprintId);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        getTask,
        updateTask,
        deleteTask,
        getTasksBySprint,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
