
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Check, Plus } from 'lucide-react';

const sprintData = [
  {
    id: 'sprint-14',
    name: 'Sprint #14',
    startDate: 'May 10, 2023',
    endDate: 'May 24, 2023',
    status: 'active',
    goals: [
      'Complete user authentication redesign',
      'Launch beta testing for new features',
      'Fix critical performance issues'
    ],
    velocity: 42,
    completedStoryPoints: 28,
    totalStoryPoints: 42
  },
  {
    id: 'sprint-13',
    name: 'Sprint #13',
    startDate: 'Apr 26, 2023',
    endDate: 'May 09, 2023',
    status: 'completed',
    goals: [
      'Implement search functionality',
      'Optimize database queries',
      'Update API documentation'
    ],
    velocity: 39,
    completedStoryPoints: 35,
    totalStoryPoints: 39
  },
  {
    id: 'sprint-12',
    name: 'Sprint #12',
    startDate: 'Apr 12, 2023',
    endDate: 'Apr 25, 2023',
    status: 'completed',
    goals: [
      'User profile management features',
      'Payment processing integration',
      'Improve test coverage'
    ],
    velocity: 36,
    completedStoryPoints: 32,
    totalStoryPoints: 36
  }
];

export default function SprintPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold tracking-tight"
                >
                  Sprint Planning
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mt-1"
                >
                  Track and manage your team's two-week cycles
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sprint
                </Button>
              </motion.div>
            </div>
          </header>
          
          <div className="space-y-6">
            {sprintData.map((sprint, index) => (
              <motion.div
                key={sprint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`glass glass-hover border border-border/40 ${
                  sprint.status === 'active' ? 'border-l-4 border-l-primary' : ''
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center">
                        <CardTitle className="text-xl font-semibold">{sprint.name}</CardTitle>
                        {sprint.status === 'active' && (
                          <span className="ml-3 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                            Active
                          </span>
                        )}
                        {sprint.status === 'completed' && (
                          <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>{sprint.startDate} - {sprint.endDate}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Sprint Goals</h3>
                        <ul className="space-y-2">
                          {sprint.goals.map((goal, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary mt-0.5" />
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Progress</h3>
                        {sprint.status === 'active' ? (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Story Points</span>
                                <span>{sprint.completedStoryPoints}/{sprint.totalStoryPoints}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}% completed
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Story Points</span>
                                <span>{sprint.completedStoryPoints}/{sprint.totalStoryPoints}</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Sprint completed with {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}% success rate
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Velocity</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-semibold">{sprint.velocity}</span>
                          <span className="text-sm text-muted-foreground mb-1">points</span>
                        </div>
                        {sprint.status === 'active' ? (
                          <p className="text-sm text-muted-foreground mt-2">
                            Projected based on current progress
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            {sprint.id === 'sprint-13' ? '+7.7%' : '+8.3%'} from previous sprint
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
