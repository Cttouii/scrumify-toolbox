
import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, AlertCircle, MessageSquare } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done';

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus; 
  assignee?: {
    name: string;
    avatar?: string;
  };
  comments?: number;
  index?: number;
}

const priorityStyles: Record<TaskPriority, { color: string, label: string }> = {
  low: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Medium' },
  high: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'High' }
};

export const TaskCard = React.forwardRef<HTMLDivElement, TaskProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ id, title, description, priority, status, assignee, comments = 0, className, index = 0, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -2 }}
        className="w-full"
      >
        <Card 
          ref={ref} 
          className={cn(
            "border border-border/40 shadow-card group hover:border-border/80 transition-all duration-200",
            className
          )}
          {...props}
        >
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
            <div className="space-y-1.5">
              <Badge 
                variant="outline"
                className={cn("px-2 py-0.5 text-xs font-medium", priorityStyles[priority].color)}
              >
                {priorityStyles[priority].label}
              </Badge>
              {status === 'inProgress' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 ml-2">
                  In Progress
                </Badge>
              )}
              {status === 'review' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 ml-2">
                  In Review
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-1.5 line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            {assignee ? (
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{assignee.name}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
            
            {comments > 0 && (
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">{comments}</span>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
