
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  endGoal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  title: string;
  description: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  sprintId: string; // can be a real sprint ID or "backlog" for backlog tasks
  projectId?: string; // Added to link directly to project for backlog tasks
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'backlog';
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  storyPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BurndownData {
  date: string;
  ideal: number;
  actual: number;
}
