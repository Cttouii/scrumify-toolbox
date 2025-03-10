
import React, { createContext, useContext, useState, useEffect } from "react";
import { Project } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { formatProjectFromSupabase } from "@/utils/formatUtils";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, project: Partial<Omit<Project, "id">>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  addProject: async () => ({ id: "", title: "", description: "", createdAt: "", updatedAt: "" }),
  getProject: () => undefined,
  updateProject: async () => ({ id: "", title: "", description: "", createdAt: "", updatedAt: "" }),
  deleteProject: async () => {},
});

export const useProjects = () => useContext(ProjectsContext);

export const ProjectsProvider: React.FC<{ 
  children: React.ReactNode;
  onProjectDelete?: (projectId: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projects: Project[];
}> = ({ children, onProjectDelete, setProjects, projects }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      if (data) {
        const formattedProjects: Project[] = data.map(formatProjectFromSupabase);
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const addProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: project.title,
          description: project.description,
          end_goal: project.endGoal,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (!data) throw new Error('Failed to create project');

      const newProject = formatProjectFromSupabase(data);
      setProjects(prev => [...prev, newProject]);
      
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const updateProject = async (id: string, project: Partial<Omit<Project, "id">>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: project.title,
          description: project.description,
          end_goal: project.endGoal,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) throw error;

      const updatedProject = {
        ...projects.find((p) => p.id === id)!,
        ...project,
        updatedAt: new Date().toISOString(),
      };

      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      
      if (onProjectDelete) {
        onProjectDelete(id);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        getProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
