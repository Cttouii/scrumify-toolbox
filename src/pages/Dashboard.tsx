
import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import ProjectCard from "@/components/projects/ProjectCard";
import NewProjectButton from "@/components/projects/NewProjectButton";

const Dashboard: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-16 pb-20 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          
          {projects.length > 0 && <NewProjectButton />}
        </div>
        
        {projects.length === 0 ? (
          <div className="rounded-lg border border-scrum-border bg-scrum-card p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No projects yet</h2>
            <p className="text-scrum-text-secondary mb-6">
              Create your first project to get started with scrum management
            </p>
            
            <NewProjectButton size="large" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
