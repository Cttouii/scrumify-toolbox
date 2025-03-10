
import { Project, Sprint, Task } from "@/types";

export const formatProjectFromSupabase = (project: any): Project => ({
  id: project.id,
  title: project.title,
  description: project.description || '',
  endGoal: project.end_goal,
  createdAt: project.created_at,
  updatedAt: project.updated_at
});

export const formatSprintFromSupabase = (sprint: any): Sprint => ({
  id: sprint.id,
  title: sprint.title,
  description: sprint.description || '',
  projectId: sprint.project_id,
  startDate: sprint.start_date,
  endDate: sprint.end_date,
  status: sprint.status as 'planned' | 'in-progress' | 'completed'
});

export const formatTaskFromSupabase = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  sprintId: task.sprint_id || '',
  status: task.status as 'todo' | 'in-progress' | 'review' | 'done' | 'backlog',
  assignedTo: task.assign_to,
  priority: task.priority,
  storyPoints: task.story_points,
  createdAt: task.created_at,
  updatedAt: task.created_at
});
