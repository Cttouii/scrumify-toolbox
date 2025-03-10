
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Project, Sprint, Task, BurndownData } from "@/types";
import { ProjectsProvider } from "./ProjectsContext";
import { SprintsProvider } from "./SprintsContext";
import { TasksProvider } from "./TasksContext";
import { BurndownProvider, useBurndown } from "./BurndownContext";
import { useProjects } from "./ProjectsContext";
import { useSprints } from "./SprintsContext";
import { useTasks } from "./TasksContext";

// Combined context interface to maintain all the existing API
interface ProjectContextType {
  projects: Project[];
  sprints: Sprint[];
  tasks: Task[];
  burndownData: Record<string, BurndownData[]>;
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, project: Partial<Omit<Project, "id">>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  addSprint: (sprint: Omit<Sprint, "id">) => Promise<Sprint>;
  getSprint: (id: string) => Sprint | undefined;
  updateSprint: (id: string, sprint: Partial<Omit<Sprint, "id">>) => Promise<Sprint>;
  deleteSprint: (id: string) => Promise<void>;
  getSprintsByProject: (projectId: string) => Sprint[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  getTask: (id: string) => Task | undefined;
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  getTasksBySprint: (sprintId: string) => Task[];
  getBurndownData: (projectId: string) => BurndownData[];
}

// Create the context with empty implementations
const ProjectContext = React.createContext<ProjectContextType>({
  projects: [],
  sprints: [],
  tasks: [],
  burndownData: {},
  addProject: async () => ({ id: "", title: "", description: "", createdAt: "", updatedAt: "" }),
  getProject: () => undefined,
  updateProject: async () => ({ id: "", title: "", description: "", createdAt: "", updatedAt: "" }),
  deleteProject: async () => {},
  addSprint: async () => ({ id: "", title: "", description: "", projectId: "", startDate: "", endDate: "", status: "planned" }),
  getSprint: () => undefined,
  updateSprint: async () => ({ id: "", title: "", description: "", projectId: "", startDate: "", endDate: "", status: "planned" }),
  deleteSprint: async () => {},
  getSprintsByProject: () => [],
  addTask: async () => ({ id: "", title: "", sprintId: "", status: "todo", createdAt: "", updatedAt: "" }),
  getTask: () => undefined,
  updateTask: async () => ({ id: "", title: "", sprintId: "", status: "todo", createdAt: "", updatedAt: "" }),
  deleteTask: async () => {},
  getTasksBySprint: () => [],
  getBurndownData: () => [],
});

// Export the hook to use the context
export const useProjects = () => React.useContext(ProjectContext);

// The main provider component that combines all context providers
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [burndownData, setBurndownData] = useState<Record<string, BurndownData[]>>({});

  // Clear all data when user changes
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setSprints([]);
      setTasks([]);
      setBurndownData({});
    }
  }, [user]);

  // Create a component that will provide the combined context
  const CombinedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Get all context values from individual providers
    const projectsContext = useProjects();
    const sprintsContext = useSprints();
    const tasksContext = useTasks();
    const burndownContext = useBurndown();

    // Combine all context values
    const combinedContext: ProjectContextType = {
      projects: projectsContext.projects,
      sprints: sprintsContext.sprints,
      tasks: tasksContext.tasks,
      burndownData: burndownContext.burndownData,
      addProject: projectsContext.addProject,
      getProject: projectsContext.getProject,
      updateProject: projectsContext.updateProject,
      deleteProject: projectsContext.deleteProject,
      addSprint: sprintsContext.addSprint,
      getSprint: sprintsContext.getSprint,
      updateSprint: sprintsContext.updateSprint,
      deleteSprint: sprintsContext.deleteSprint,
      getSprintsByProject: sprintsContext.getSprintsByProject,
      addTask: tasksContext.addTask,
      getTask: tasksContext.getTask,
      updateTask: tasksContext.updateTask,
      deleteTask: tasksContext.deleteTask,
      getTasksBySprint: tasksContext.getTasksBySprint,
      getBurndownData: burndownContext.getBurndownData,
    };

    return (
      <ProjectContext.Provider value={combinedContext}>
        {children}
      </ProjectContext.Provider>
    );
  };

  // Function to handle task status changes for burndown chart
  const handleTaskStatusChange = (task: Task, oldStatus: string) => {
    if (!task.storyPoints) return;
    
    const sprint = sprints.find(s => s.id === task.sprintId);
    if (!sprint) return;
    
    if (oldStatus !== "done" && task.status === "done") {
      updateBurndownData(
        sprint.projectId,
        task.storyPoints,
        "complete"
      );
    }
  };

  // Burndown chart data management
  const generateDefaultBurndownData = (): BurndownData[] => {
    const data: BurndownData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split("T")[0],
        ideal: 0,
        actual: 0,
      });
    }
    
    return data;
  };

  const updateBurndownData = (
    projectId: string,
    points: number,
    action: "add" | "complete" | "remove"
  ) => {
    if (!projectId || !points) return;
    
    setBurndownData((prev) => {
      const projectData = prev[projectId] || generateDefaultBurndownData();
      const today = new Date().toISOString().split("T")[0];
      
      const updatedData = projectData.map((item) => {
        if (item.date >= today) {
          if (action === "add") {
            return { ...item, ideal: item.ideal + points };
          } else if (action === "remove") {
            return { ...item, ideal: Math.max(0, item.ideal - points) };
          }
        }
        
        if (item.date === today) {
          if (action === "complete") {
            return { ...item, actual: item.actual + points };
          } else if (action === "remove" && item.actual > 0) {
            return { ...item, actual: Math.max(0, item.actual - points) };
          }
        }
        
        return item;
      });
      
      return { ...prev, [projectId]: updatedData };
    });
  };

  const handleProjectDeleted = (projectId: string) => {
    const projectSprints = sprints.filter(s => s.projectId === projectId);
    const sprintIds = projectSprints.map(s => s.id);
    
    setSprints(prev => prev.filter(s => s.projectId !== projectId));
    setTasks(prev => prev.filter(t => !sprintIds.includes(t.sprintId)));
    
    setBurndownData(prev => {
      const newData = { ...prev };
      delete newData[projectId];
      return newData;
    });
  };

  // Nest all providers
  return (
    <ProjectsProvider 
      projects={projects} 
      setProjects={setProjects}
      onProjectDelete={handleProjectDeleted}
    >
      <SprintsProvider 
        sprints={sprints} 
        setSprints={setSprints}
        onSprintDelete={(sprintId) => {
          setTasks(prev => prev.filter(t => t.sprintId !== sprintId));
        }}
      >
        <TasksProvider 
          tasks={tasks} 
          setTasks={setTasks}
          getSprint={(id) => sprints.find(s => s.id === id)}
          onTaskStatusChange={handleTaskStatusChange}
        >
          <BurndownProvider>
            <CombinedProvider>
              {children}
            </CombinedProvider>
          </BurndownProvider>
        </TasksProvider>
      </SprintsProvider>
    </ProjectsProvider>
  );
};
