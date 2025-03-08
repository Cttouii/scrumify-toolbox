
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import TaskBoard from '@/components/TaskBoard';
import TeamMembers from '@/components/TeamMembers';

export default function Index() {
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
                  Project Dashboard
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground mt-1"
                >
                  Sprint #14 — May 10 - 24, 2023
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2"
              >
                <div className="glass rounded-md px-4 py-2 text-sm">
                  <span className="text-muted-foreground mr-1">Days remaining:</span>
                  <span className="font-medium">8</span>
                </div>
              </motion.div>
            </div>
          </header>
          
          <div className="space-y-8">
            <DashboardStats />
            <TaskBoard />
            <TeamMembers />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
