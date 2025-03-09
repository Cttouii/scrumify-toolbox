
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { Edit, AlertTriangle } from "lucide-react";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SprintHeader = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const { getSprint, getProject, updateSprint } = useProjects();
  const navigate = useNavigate();
  
  const sprint = getSprint(sprintId || "");
  const project = sprint ? getProject(sprint.projectId) : undefined;
  
  const handleEditSprint = () => {
    if (sprint) {
      navigate(`/projects/${sprint.projectId}/sprint/${sprint.id}/edit`);
    }
  };
  
  const getStatusBadge = () => {
    if (!sprint) return null;
    
    switch (sprint.status) {
      case 'planned':
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/40">
            Planned
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/40">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/40">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleCompleteSprint = async () => {
    if (!sprint) return;
    
    if (window.confirm("Are you sure you want to mark this sprint as completed?")) {
      try {
        await updateSprint(sprint.id, {
          status: "completed"
        });
        toast.success("Sprint marked as completed");
      } catch (error) {
        console.error("Error completing sprint:", error);
        toast.error("Failed to complete sprint");
      }
    }
  };
  
  if (!sprint || !project) {
    return (
      <div className="p-4 bg-scrum-card border-b border-scrum-border">
        <p>Sprint not found</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-scrum-card border-b border-scrum-border">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{sprint.title}</h1>
            {getStatusBadge()}
          </div>
          <p className="text-scrum-text-secondary text-sm">
            {formatDate(sprint.startDate)} to {formatDate(sprint.endDate)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {sprint.status !== "completed" && (
            <>
              <button
                onClick={handleEditSprint}
                className="scrum-button-secondary flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Sprint</span>
              </button>
              
              {sprint.status === "in-progress" && (
                <button
                  onClick={handleCompleteSprint}
                  className="scrum-button flex items-center gap-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Complete Sprint</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {sprint.description && (
        <div className="mt-2">
          <p className="text-sm">{sprint.description}</p>
        </div>
      )}
    </div>
  );
};

export default SprintHeader;
