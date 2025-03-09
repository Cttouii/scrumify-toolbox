
import { useState, useEffect } from "react";
import { useProjects } from "@/context/ProjectContext";
import { Sprint, Task } from "@/types";
import { toast } from "sonner";

interface BoardColumn {
  title: string;
  taskIds: string[];
}

type Columns = {
  [key: string]: BoardColumn;
}

export const useSprintBoard = (sprintId: string) => {
  const { getSprint, getTasksBySprint, updateSprint, updateTask } = useProjects();
  
  const [columns, setColumns] = useState<Columns>({
    "todo": { title: "TO DO", taskIds: [] },
    "in-progress": { title: "IN PROGRESS", taskIds: [] },
    "done": { title: "DONE", taskIds: [] }
  });
  
  const [columnOrder, setColumnOrder] = useState<string[]>(["todo", "in-progress", "done"]);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [creatingTaskInColumn, setCreatingTaskInColumn] = useState<string | null>(null);
  
  const sprint: Sprint | undefined = getSprint(sprintId);
  const tasks: Task[] = getTasksBySprint(sprintId);
  
  useEffect(() => {
    if (!sprint) return;
    
    const initialColumns: Columns = {};
    
    ["todo", "in-progress", "done"].forEach(colId => {
      initialColumns[colId] = {
        title: colId === "todo" ? "TO DO" : 
               colId === "in-progress" ? "IN PROGRESS" : 
               "DONE",
        taskIds: []
      };
    });
    
    const customStatuses = new Set<string>();
    tasks.forEach(task => {
      if (!["todo", "in-progress", "done"].includes(task.status)) {
        customStatuses.add(task.status);
      }
    });
    
    customStatuses.forEach(status => {
      initialColumns[status] = {
        title: status.toUpperCase().replace(/-/g, ' '),
        taskIds: []
      };
    });
    
    tasks.forEach(task => {
      if (initialColumns[task.status]) {
        initialColumns[task.status].taskIds.push(task.id);
      } else {
        initialColumns[task.status] = {
          title: task.status.toUpperCase().replace(/-/g, ' '),
          taskIds: [task.id]
        };
      }
    });
    
    const newColumnOrder = [...columnOrder];
    Object.keys(initialColumns).forEach(colId => {
      if (!newColumnOrder.includes(colId)) {
        newColumnOrder.push(colId);
      }
    });
    
    setColumns(initialColumns);
    setColumnOrder(newColumnOrder);
  }, [sprint, tasks]);
  
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId && 
      destination.index === source.index
    ) {
      return;
    }
    
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    if (source.droppableId === destination.droppableId) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };
      
      setColumns({
        ...columns,
        [source.droppableId]: newColumn,
      });
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);
      
      const destTaskIds = Array.from(destColumn.taskIds);
      destTaskIds.splice(destination.index, 0, draggableId);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
        [destination.droppableId]: {
          ...destColumn,
          taskIds: destTaskIds,
        },
      });
      
      try {
        await updateTask(draggableId, {
          status: destination.droppableId
        });
        
        if (destination.droppableId === "done") {
          const allTasks = tasks;
          const remainingTasks = allTasks.filter(
            task => task.id !== draggableId && task.status !== "done"
          );
          
          if (remainingTasks.length === 0 && sprint && sprint.status === "in-progress") {
            if (window.confirm("All tasks are completed! Would you like to mark this sprint as completed?")) {
              await updateSprint(sprint.id, { status: "completed" });
              toast.success("Sprint marked as completed!");
            }
          }
        }
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      }
    }
  };
  
  const handleAddColumn = (columnName: string) => {
    if (!columnName.trim()) return;
    
    const columnId = columnName.toLowerCase().replace(/\s+/g, '-');
    
    if (columns[columnId]) {
      toast.error("A column with this name already exists");
      return;
    }
    
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        title: columnName,
        taskIds: []
      }
    }));
    
    setColumnOrder(prev => [...prev, columnId]);
    setIsAddColumnModalOpen(false);
    toast.success(`Column "${columnName}" added`);
  };
  
  const handleRemoveColumn = (columnId: string) => {
    if (["todo", "in-progress", "done"].includes(columnId)) {
      toast.error("Cannot remove default columns");
      return;
    }
    
    if (columns[columnId]?.taskIds.length > 0) {
      toast.error("Cannot remove a column that contains tasks");
      return;
    }
    
    const newColumns = { ...columns };
    delete newColumns[columnId];
    
    setColumns(newColumns);
    setColumnOrder(columnOrder.filter(id => id !== columnId));
    toast.success("Column removed");
  };
  
  const handleCompleteSprint = async () => {
    if (!sprint) return;
    
    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === "done");
    
    if (!allTasksCompleted) {
      if (!window.confirm("Not all tasks are completed. Are you sure you want to complete this sprint?")) {
        return;
      }
    }
    
    try {
      await updateSprint(sprint.id, { status: "completed" });
      toast.success("Sprint marked as completed!");
    } catch (error) {
      console.error("Error completing sprint:", error);
      toast.error("Failed to complete sprint");
    }
  };
  
  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === "done");
  
  return {
    sprint,
    tasks,
    columns,
    columnOrder,
    editingTask,
    isAddColumnModalOpen,
    creatingTaskInColumn,
    allTasksCompleted,
    setEditingTask,
    setIsAddColumnModalOpen,
    setCreatingTaskInColumn,
    handleDragEnd,
    handleAddColumn,
    handleRemoveColumn,
    handleCompleteSprint
  };
};
