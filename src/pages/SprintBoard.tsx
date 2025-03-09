
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useSprintBoard } from "@/hooks/useSprintBoard";
import SprintHeader from "@/components/sprints/SprintHeader";
import BoardColumn from "@/components/sprints/BoardColumn";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import AddColumnModal from "@/components/sprints/AddColumnModal";
import NewTaskForm from "@/components/tasks/NewTaskForm";

const SprintBoard: React.FC = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const navigate = useNavigate();
  
  const {
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
  } = useSprintBoard(sprintId || "");
  
  if (!sprint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Sprint not found</h2>
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
    <div className="container mx-auto pb-20 px-4 mt-8">
      <SprintHeader 
        sprint={sprint}
        onCompleteSprint={handleCompleteSprint}
        allTasksCompleted={allTasksCompleted}
        onOpenAddColumnModal={() => setIsAddColumnModalOpen(true)}
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4 overflow-x-auto">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            
            if (!column) return null;
            
            return (
              <BoardColumn
                key={columnId}
                columnId={columnId}
                column={column}
                tasks={tasks}
                isSprintCompleted={sprint.status === "completed"}
                onCreateTask={setCreatingTaskInColumn}
                onRemoveColumn={handleRemoveColumn}
                onEditTask={setEditingTask}
              />
            );
          })}
        </div>
      </DragDropContext>
      
      {editingTask && (
        <EditTaskModal
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
      
      {isAddColumnModalOpen && (
        <AddColumnModal
          onClose={() => setIsAddColumnModalOpen(false)}
          onAdd={handleAddColumn}
        />
      )}
      
      {creatingTaskInColumn && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-scrum-card border border-scrum-border rounded-lg p-6 w-full max-w-lg animate-fade-up">
            <NewTaskForm 
              sprintId={sprint.id}
              initialStatus={creatingTaskInColumn}
              onClose={() => setCreatingTaskInColumn(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintBoard;
