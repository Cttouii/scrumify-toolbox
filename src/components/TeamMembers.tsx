
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  tasksCompleted: number;
  tasksInProgress: number;
};

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Kim',
    role: 'Frontend Developer',
    avatar: '',
    status: 'active',
    tasksCompleted: 12,
    tasksInProgress: 3,
  },
  {
    id: '2',
    name: 'Jamie Chen',
    role: 'UX Designer',
    avatar: '',
    status: 'active',
    tasksCompleted: 8,
    tasksInProgress: 2,
  },
  {
    id: '3',
    name: 'Morgan Smith',
    role: 'Backend Developer',
    avatar: '',
    status: 'away',
    tasksCompleted: 15,
    tasksInProgress: 1,
  },
  {
    id: '4',
    name: 'Taylor Reed',
    role: 'Product Manager',
    avatar: '',
    status: 'offline',
    tasksCompleted: 6,
    tasksInProgress: 0,
  },
];

const statusStyles = {
  active: { color: 'bg-green-500', label: 'Active' },
  away: { color: 'bg-amber-500', label: 'Away' },
  offline: { color: 'bg-gray-400', label: 'Offline' }
};

export function TeamMembers() {
  return (
    <div className="mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6"
      >
        Team
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockTeamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass glass-hover border border-border/40 h-full">
              <CardContent className="pt-6 px-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute bottom-3 right-0 h-3 w-3 rounded-full ring-2 ring-white ${statusStyles[member.status].color}`}
                    />
                  </div>
                  
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </CardContent>
              
              <CardFooter className="pb-6 px-6 flex justify-between">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {member.tasksCompleted}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {member.tasksInProgress}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TeamMembers;
