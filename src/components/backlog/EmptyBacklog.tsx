
import React from "react";
import { AlignJustify } from "lucide-react";

const EmptyBacklog: React.FC = () => {
  return (
    <div className="p-8 text-center text-scrum-text-secondary">
      <AlignJustify className="h-12 w-12 mx-auto mb-3 opacity-30" />
      <p>No tasks in the backlog</p>
      <p className="text-sm mt-1">
        Add tasks to track work that needs to be done
      </p>
    </div>
  );
};

export default EmptyBacklog;
