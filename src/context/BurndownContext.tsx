
import React, { createContext, useContext, useState } from "react";
import { BurndownData, Task } from "@/types";

interface BurndownContextType {
  burndownData: Record<string, BurndownData[]>;
  getBurndownData: (projectId: string) => BurndownData[];
}

const BurndownContext = createContext<BurndownContextType>({
  burndownData: {},
  getBurndownData: () => [],
});

export const useBurndown = () => useContext(BurndownContext);

export const BurndownProvider: React.FC<{ 
  children: React.ReactNode;
}> = ({ children }) => {
  const [burndownData, setBurndownData] = useState<Record<string, BurndownData[]>>({});

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

  const handleTaskStatusChange = (task: Task, oldStatus: string) => {
    if (!task.storyPoints) return;
    
    // If task is marked as done, update burndown
    if (oldStatus !== "done" && task.status === "done") {
      const sprint = null; // In the integrated context, you'd get this from getSprint
      if (sprint && sprint.projectId) {
        updateBurndownData(
          sprint.projectId,
          task.storyPoints,
          "complete"
        );
      }
    }
  };

  const handleProjectAdded = (projectId: string) => {
    setBurndownData(prev => ({
      ...prev,
      [projectId]: generateDefaultBurndownData(),
    }));
  };

  const handleProjectDeleted = (projectId: string) => {
    setBurndownData(prev => {
      const newData = { ...prev };
      delete newData[projectId];
      return newData;
    });
  };

  const getBurndownData = (projectId: string) => 
    burndownData[projectId] || generateDefaultBurndownData();

  return (
    <BurndownContext.Provider
      value={{
        burndownData,
        getBurndownData,
      }}
    >
      {children}
    </BurndownContext.Provider>
  );
};
