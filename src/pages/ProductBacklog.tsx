
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useBacklog } from "@/hooks/useBacklog";
import BacklogTaskForm from "@/components/backlog/BacklogTaskForm";
import EditBacklogTaskForm from "@/components/backlog/EditBacklogTaskForm";
import BacklogTaskItem from "@/components/backlog/BacklogTaskItem";
import EmptyBacklog from "@/components/backlog/EmptyBacklog";

const ProductBacklog: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const {
    project,
    backlogTasks,
    availableSprints,
    movingTaskId,
    setMovingTaskId,
    handleMoveToSprint,
    handleDeleteTask
  } = useBacklog(projectId);
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Project not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="scrum-button"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Product Backlog</h2>
          <p className="text-scrum-text-secondary">
            Tasks waiting to be assigned to a sprint
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingTask(true)}
          className="scrum-button flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>
      
      <div className="bg-scrum-card border border-scrum-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-scrum-border flex items-center justify-between">
          <h3 className="font-medium">Backlog Items</h3>
          <span className="text-sm text-scrum-text-secondary">
            {backlogTasks.length} {backlogTasks.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {backlogTasks.length === 0 ? (
          <EmptyBacklog />
        ) : (
          <div className="divide-y divide-scrum-border">
            {backlogTasks.map(task => (
              <BacklogTaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onToggleMove={id => setMovingTaskId(id === movingTaskId ? null : id)}
                isMoving={task.id === movingTaskId}
                availableSprints={availableSprints}
                onMoveToSprint={handleMoveToSprint}
              />
            ))}
          </div>
        )}
      </div>
      
      {isAddingTask && (
        <BacklogTaskForm 
          projectId={project.id}
          onClose={() => setIsAddingTask(false)}
        />
      )}
      
      {editingTask && (
        <EditBacklogTaskForm
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default ProductBacklog;
