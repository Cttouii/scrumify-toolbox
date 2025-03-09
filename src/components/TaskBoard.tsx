
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard, TaskProps } from './TaskCard';
import { cn } from '@/lib/utils';

// Mock data
const mockTasks: TaskProps[] = [
  {
    id: '1',
    title: 'Update user authentication flow',
    description: 'Implement new security protocols and improve login experience.',
    priority: 'high',
    status: 'todo',
    assignee: {
      name: 'Alex Kim',
      avatar: '',
    },
    comments: 3,
  },
  {
    id: '2',
    title: 'Design product page layouts',
    description: 'Create responsive designs for the new product landing pages.',
    priority: 'medium',
    status: 'todo',
    assignee: {
      name: 'Jamie Chen',
      avatar: '',
    },
    comments: 5,
  },
  {
    id: '3',
    title: 'API documentation update',
    description: 'Review and update all endpoints documentation for v2 release.',
    priority: 'low',
    status: 'todo',
    comments: 1,
  },
  {
    id: '4',
    title: 'Implement cart checkout functionality',
    description: 'Connect payment gateway and enhance UX for checkout process.',
    priority: 'high',
    status: 'inProgress',
    assignee: {
      name: 'Morgan Smith',
      avatar: '',
    },
    comments: 7,
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance by optimizing slow database operations.',
    priority: 'medium',
    status: 'inProgress',
    assignee: {
      name: 'Taylor Reed',
      avatar: '',
    },
  },
  {
    id: '6',
    title: 'Code review: Search feature',
    description: 'Review PR #287 for the enhanced search functionality.',
    priority: 'medium',
    status: 'review',
    assignee: {
      name: 'Alex Kim',
      avatar: '',
    },
    comments: 4,
  },
  {
    id: '7',
    title: 'Fix responsive layout issues',
    description: 'Address layout breakages on small screen devices.',
    priority: 'low',
    status: 'done',
    assignee: {
      name: 'Jamie Chen',
      avatar: '',
    },
  },
  {
    id: '8',
    title: 'Update privacy policy',
    description: 'Update documents to comply with latest regulations.',
    priority: 'high',
    status: 'done',
    assignee: {
      name: 'Morgan Smith',
      avatar: '',
    },
    comments: 2,
  },
];

type Column = {
  id: string;
  title: string;
  status: TaskProps['status'];
  color: string;
};

const columns: Column[] = [
  { id: 'todo', title: 'To Do', status: 'todo', color: 'before:bg-gray-400' },
  { id: 'inProgress', title: 'In Progress', status: 'inProgress', color: 'before:bg-blue-400' },
  { id: 'review', title: 'Review', status: 'review', color: 'before:bg-purple-400' },
  { id: 'done', title: 'Done', status: 'done', color: 'before:bg-green-400' },
];

export function TaskBoard() {
  const [tasks] = useState<TaskProps[]>(mockTasks);

  const getTasksByStatus = (status: TaskProps['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold"
        >
          Sprint Board
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button size="sm" className="h-9">
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: columnIndex * 0.1 }}
            className="flex flex-col h-full"
          >
            <div className={cn(
              "flex items-center mb-3 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:rounded-full",
              column.color
            )}>
              <h3 className="font-medium text-sm">{column.title}</h3>
              <div className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-xs font-medium">
                {getTasksByStatus(column.status).length}
              </div>
            </div>
            
            <div className="flex-1 p-1 glass rounded-lg min-h-[200px]">
              <div className="space-y-3 p-2 h-full max-h-[calc(100vh-300px)] overflow-y-auto">
                {getTasksByStatus(column.status).map((task, taskIndex) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    index={taskIndex}
                  />
                ))}
                
                {getTasksByStatus(column.status).length === 0 && (
                  <div className="flex items-center justify-center h-20 border border-dashed border-border/60 rounded-md bg-secondary/50">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TaskBoard;
