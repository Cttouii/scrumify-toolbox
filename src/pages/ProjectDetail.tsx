
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import SprintCard from "@/components/sprints/SprintCard";
import NewSprintButton from "@/components/sprints/NewSprintButton";
import { format } from "date-fns";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProject, getSprintsByProject } = useProjects();
  
  const project = getProject(projectId || "");
  const sprints = getSprintsByProject(projectId || "");
  
  const activeSprint = sprints.find(sprint => sprint.status === "in-progress");
  const plannedSprints = sprints.filter(sprint => sprint.status === "planned");
  const completedSprints = sprints.filter(sprint => sprint.status === "completed");
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Project not found</h2>
        <button
          onClick={() => navigate("/")}
          className="scrum-button"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Sprints</h2>
          
          <NewSprintButton projectId={project.id} />
        </div>
        
        {sprints.length === 0 ? (
          <div className="bg-scrum-card border border-scrum-border rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No sprints yet</h3>
            <p className="text-scrum-text-secondary mb-6">
              Start planning your project by creating your first sprint
            </p>
            
            <NewSprintButton projectId={project.id} size="large" />
          </div>
        ) : (
          <>
            {activeSprint && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Active Sprint</h3>
                <div className="grid gap-4">
                  <SprintCard
                    sprint={activeSprint}
                    onEdit={() => navigate(`/projects/${project.id}/sprint/${activeSprint.id}/edit`)}
                    onViewBoard={() => navigate(`/sprints/${activeSprint.id}`)}
                  />
                </div>
              </div>
            )}
            
            {plannedSprints.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Planned Sprints</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plannedSprints.map(sprint => (
                    <SprintCard
                      key={sprint.id}
                      sprint={sprint}
                      onEdit={() => navigate(`/projects/${project.id}/sprint/${sprint.id}/edit`)}
                      onViewBoard={() => navigate(`/sprints/${sprint.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {completedSprints.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Completed Sprints</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedSprints.map(sprint => (
                    <SprintCard
                      key={sprint.id}
                      sprint={sprint}
                      onEdit={() => navigate(`/projects/${project.id}/sprint/${sprint.id}/edit`)}
                      onViewBoard={() => navigate(`/sprints/${sprint.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
