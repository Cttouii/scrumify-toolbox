
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { Sprint } from "@/types";

interface SprintHeaderProps {
  sprint: Sprint;
  onCompleteSprint: () => void;
  allTasksCompleted: boolean;
  onOpenAddColumnModal: () => void;
}

const SprintHeader: React.FC<SprintHeaderProps> = ({
  sprint,
  onCompleteSprint,
  allTasksCompleted,
  onOpenAddColumnModal
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/projects/${sprint.projectId}`)}
          className="text-scrum-text-secondary hover:text-white flex items-center gap-1 mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Project</span>
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{sprint.title}</h2>
            {sprint.status === "completed" && (
              <span className="bg-success text-white text-xs px-2 py-1 rounded-full">
                Completed
              </span>
            )}
          </div>
          <p className="text-scrum-text-secondary">{sprint.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {sprint.status !== "completed" && (
            <>
              <button
                onClick={() => navigate(`/projects/${sprint.projectId}/sprint/${sprint.id}/edit`)}
                className="scrum-button-secondary flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Sprint</span>
              </button>
              
              <button
                onClick={onCompleteSprint}
                className={`scrum-button ${allTasksCompleted ? "bg-success hover:bg-success/90" : ""}`}
                disabled={sprint.status === "completed"}
              >
                Complete Sprint
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Sprint Board</h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/projects/${sprint.projectId}/backlog`)}
            className="scrum-button-secondary flex items-center gap-1 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Product Backlog</span>
          </button>
          
          <button
            onClick={onOpenAddColumnModal}
            className="scrum-button-secondary flex items-center gap-1 text-sm"
            disabled={sprint.status === "completed"}
          >
            <Plus className="h-4 w-4" />
            <span>Add Column</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SprintHeader;
