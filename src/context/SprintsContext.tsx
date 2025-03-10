
import React, { createContext, useContext, useState, useEffect } from "react";
import { Sprint } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { formatSprintFromSupabase } from "@/utils/formatUtils";

interface SprintsContextType {
  sprints: Sprint[];
  addSprint: (sprint: Omit<Sprint, "id">) => Promise<Sprint>;
  getSprint: (id: string) => Sprint | undefined;
  updateSprint: (id: string, sprint: Partial<Omit<Sprint, "id">>) => Promise<Sprint>;
  deleteSprint: (id: string) => Promise<void>;
  getSprintsByProject: (projectId: string) => Sprint[];
}

const SprintsContext = createContext<SprintsContextType>({
  sprints: [],
  addSprint: async () => ({ id: "", title: "", description: "", projectId: "", startDate: "", endDate: "", status: "planned" }),
  getSprint: () => undefined,
  updateSprint: async () => ({ id: "", title: "", description: "", projectId: "", startDate: "", endDate: "", status: "planned" }),
  deleteSprint: async () => {},
  getSprintsByProject: () => [],
});

export const useSprints = () => useContext(SprintsContext);

export const SprintsProvider: React.FC<{ 
  children: React.ReactNode;
  onSprintDelete?: (sprintId: string) => void;
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  sprints: Sprint[];
}> = ({ children, onSprintDelete, setSprints, sprints }) => {
  const { user } = useAuth();

  const fetchSprintsForProject = async (projectId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching sprints:', error);
        return;
      }

      if (data) {
        const formattedSprints: Sprint[] = data.map(formatSprintFromSupabase);

        setSprints(prev => {
          const filtered = prev.filter(s => s.projectId !== projectId);
          return [...filtered, ...formattedSprints];
        });
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  };

  const addSprint = async (sprint: Omit<Sprint, "id">) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('sprints')
        .insert([{
          title: sprint.title,
          description: sprint.description,
          project_id: sprint.projectId,
          start_date: sprint.startDate,
          end_date: sprint.endDate,
          status: sprint.status,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      if (!data) throw new Error('Failed to create sprint');

      const newSprint = formatSprintFromSupabase(data);
      setSprints(prev => [...prev, newSprint]);
      
      return newSprint;
    } catch (error) {
      console.error('Error adding sprint:', error);
      throw error;
    }
  };

  const getSprint = (id: string) => sprints.find((s) => s.id === id);

  const updateSprint = async (id: string, sprint: Partial<Omit<Sprint, "id">>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('sprints')
        .update({
          title: sprint.title,
          description: sprint.description,
          start_date: sprint.startDate,
          end_date: sprint.endDate,
          status: sprint.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedSprint = {
        ...sprints.find(s => s.id === id)!,
        ...sprint,
      };

      setSprints(prev => prev.map(s => s.id === id ? updatedSprint : s));
      
      return updatedSprint;
    } catch (error) {
      console.error('Error updating sprint:', error);
      throw error;
    }
  };

  const deleteSprint = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('sprints')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSprints(prev => prev.filter(s => s.id !== id));
      
      if (onSprintDelete) {
        onSprintDelete(id);
      }
    } catch (error) {
      console.error('Error deleting sprint:', error);
      throw error;
    }
  };

  const getSprintsByProject = (projectId: string) => 
    sprints.filter((s) => s.projectId === projectId);

  return (
    <SprintsContext.Provider
      value={{
        sprints,
        addSprint,
        getSprint,
        updateSprint,
        deleteSprint,
        getSprintsByProject,
      }}
    >
      {children}
    </SprintsContext.Provider>
  );
};
