
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash } from "lucide-react";
import TaskCard from "@/components/tasks/TaskCard";
import { Task } from "@/types";

interface BoardColumnProps {
  columnId: string;
  column: {
    title: string;
    taskIds: string[];
  };
  tasks: Task[];
  isSprintCompleted: boolean;
  onCreateTask: (columnId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onEditTask: (taskId: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  columnId,
  column,
  tasks,
  isSprintCompleted,
  onCreateTask,
  onRemoveColumn,
  onEditTask
}) => {
  const columnTasks = column.taskIds
    .map(taskId => tasks.find(task => task.id === taskId))
    .filter(Boolean) as Task[];

  const isDefaultColumn = ["todo", "in-progress", "done"].includes(columnId);

  return (
    <div className="min-w-[270px]">
      <div className="bg-scrum-card border border-scrum-border rounded-md h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-scrum-border">
          <h4 className="font-medium text-sm">{column.title}</h4>
          <div className="flex items-center">
            {!isSprintCompleted && (
              <button
                onClick={() => onCreateTask(columnId)}
                className="text-scrum-text-secondary hover:text-white transition-colors mr-2"
                title={`Add task to ${column.title}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            
            {!isDefaultColumn && (
              <button
                onClick={() => onRemoveColumn(columnId)}
                className="text-scrum-text-secondary hover:text-destructive transition-colors"
                disabled={isSprintCompleted}
                title="Remove column"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <Droppable droppableId={columnId} isDropDisabled={isSprintCompleted}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-2 flex-1 min-h-[300px] overflow-y-auto ${snapshot.isDraggingOver ? "bg-scrum-accent/10" : ""}`}
            >
              {columnTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={isSprintCompleted}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-2 transition-transform duration-200 ${snapshot.isDragging ? "scale-105 shadow-lg opacity-90 z-10" : ""}`}
                    >
                      <TaskCard
                        task={task}
                        onEdit={() => onEditTask(task.id)}
                        isSprintCompleted={isSprintCompleted}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-4 text-scrum-text-secondary text-sm italic">
                  No tasks
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default BoardColumn;
