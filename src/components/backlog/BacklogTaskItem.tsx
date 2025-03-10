
import React from "react";
import { Edit, Trash, MoveRight } from "lucide-react";
import { Task, Sprint } from "@/types";

interface BacklogTaskItemProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleMove: (taskId: string) => void;
  isMoving: boolean;
  availableSprints: Sprint[];
  onMoveToSprint: (taskId: string, sprintId: string) => void;
}

const BacklogTaskItem: React.FC<BacklogTaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleMove,
  isMoving,
  availableSprints,
  onMoveToSprint
}) => {
  return (
    <div className="p-4 hover:bg-scrum-background/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium mb-1">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-scrum-text-secondary mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {task.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.priority === 'high' ? 'bg-destructive/80 text-white' :
                task.priority === 'medium' ? 'bg-orange-500/80 text-white' :
                'bg-blue-500/80 text-white'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            )}
            
            {task.storyPoints && (
              <span className="bg-scrum-accent/30 text-xs px-2 py-0.5 rounded-full">
                {task.storyPoints} {task.storyPoints === 1 ? "point" : "points"}
              </span>
            )}
            
            {task.assignedTo && (
              <span className="bg-scrum-card text-xs px-2 py-0.5 rounded-full border border-scrum-border">
                {task.assignedTo}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(task.id)}
            className="text-scrum-text-secondary hover:text-white transition-colors p-1"
            title="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onToggleMove(task.id)}
            className="text-scrum-text-secondary hover:text-blue-400 transition-colors p-1"
            title="Move to sprint"
            disabled={availableSprints.length === 0}
          >
            <MoveRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-scrum-text-secondary hover:text-destructive transition-colors p-1"
            title="Delete task"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isMoving && availableSprints.length > 0 && (
        <div className="mt-4 border-t border-scrum-border pt-3">
          <h5 className="text-sm font-medium mb-2">Move to Sprint:</h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableSprints.map(sprint => (
              <button
                key={sprint.id}
                onClick={() => onMoveToSprint(task.id, sprint.id)}
                className="text-xs border border-scrum-border rounded px-2 py-1 hover:bg-scrum-accent/20 transition-colors text-left overflow-hidden whitespace-nowrap overflow-ellipsis"
                title={sprint.title}
              >
                {sprint.title}
              </button>
            ))}
          </div>
          <button
            onClick={() => onToggleMove(task.id)}
            className="text-xs text-scrum-text-secondary hover:text-white mt-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BacklogTaskItem;
