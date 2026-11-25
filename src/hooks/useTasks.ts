import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { storageService } from '../services/storageService';
import { withProgress } from '../utils/progress';

/**
 * Custom Hook: useTasks
 * 
 * Purpose:
 * Coordinates task assignments, priorities, statuses and automatically updates
 * project progress percentages when task states change.
 * 
 * Usage:
 * ```tsx
 * const { tasks, addTask, updateTask, deleteTask } = useTasks();
 * ```
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());

  // Recalculate every project, not only the one on the task: an edit can move a task between
  // projects, and deleting the last task has to bring its project back to 0.
  const syncProgress = useCallback((currentTasks: Task[]) => {
    storageService.saveProjects(withProgress(storageService.getProjects(), currentTasks));
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const currentTasks = storageService.getTasks();
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
    };

    const updated = [...currentTasks, newTask];
    storageService.saveTasks(updated);
    setTasks(updated);

    syncProgress(updated);

    // Add activity log
    const activities = storageService.getActivities();
    storageService.saveActivities([
      {
        id: `a-${Date.now()}`,
        icon: '📋',
        color: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
        text: 'New Task Created',
        sub: `Added task "${newTask.title}" with ${newTask.priority} priority.`,
        by: 'Admin',
        time: 'Just now',
      },
      ...activities,
    ]);

    return newTask;
  }, [syncProgress]);

  const updateTask = useCallback((id: string, taskData: Partial<Task>) => {
    const currentTasks = storageService.getTasks();
    const updated = currentTasks.map((t) => (t.id === id ? { ...t, ...taskData } : t));

    storageService.saveTasks(updated);
    setTasks(updated);

    syncProgress(updated);
  }, [syncProgress]);

  const deleteTask = useCallback((id: string) => {
    const currentTasks = storageService.getTasks();
    const taskToDelete = currentTasks.find(t => t.id === id);
    const updated = currentTasks.filter((t) => t.id !== id);

    storageService.saveTasks(updated);
    setTasks(updated);

    syncProgress(updated);

    if (taskToDelete) {
      // Add activity log
      const activities = storageService.getActivities();
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '🗑️',
          color: 'bg-red-100 dark:bg-red-500/15 text-red-500',
          text: 'Task Deleted',
          sub: `Removed task "${taskToDelete.title}".`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    }
  }, [syncProgress]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
}
