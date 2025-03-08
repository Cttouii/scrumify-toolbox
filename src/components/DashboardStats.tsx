
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
};

const StatCard = ({ title, value, description, icon, color, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay * 0.1 }}
    className="glass glass-hover rounded-xl p-6 flex flex-col"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
      <div className={cn("p-2 rounded-full", color)}>
        {icon}
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export function DashboardStats() {
  const sprintProgress = 68;

  return (
    <div className="mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6"
      >
        Current Sprint Overview
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Completed Tasks"
          value="24"
          description="8 tasks completed today"
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          color="bg-emerald-500/90"
          delay={0}
        />
        
        <StatCard
          title="In Progress"
          value="13"
          description="3 tasks updated recently"
          icon={<Clock className="h-5 w-5 text-white" />}
          color="bg-blue-500/90"
          delay={1}
        />
        
        <StatCard
          title="Blocked Tasks"
          value="3"
          description="1 high priority issue"
          icon={<AlertCircle className="h-5 w-5 text-white" />}
          color="bg-amber-500/90"
          delay={2}
        />
        
        <StatCard
          title="Team Velocity"
          value="42"
          description="7% increase from last sprint"
          icon={<Users className="h-5 w-5 text-white" />}
          color="bg-violet-500/90"
          delay={3}
        />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Sprint Progress</span>
          <span className="text-sm text-muted-foreground">{sprintProgress}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${sprintProgress}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">May 10</span>
          <span className="text-xs text-muted-foreground">May 24</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
