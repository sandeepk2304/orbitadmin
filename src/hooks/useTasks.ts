import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { storageService } from '../services/storageService';

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

  const updateProjectProgress = useCallback((projectId: string, currentTasks: Task[]) => {
    const projectTasks = currentTasks.filter((t) => t.projectId === projectId);
    if (projectTasks.length === 0) return;

    const doneTasks = projectTasks.filter((t) => t.status === 'Done').length;
    const progress = Math.round((doneTasks / projectTasks.length) * 100);

    const projects = storageService.getProjects();
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, progress };
      }
      return p;
    });
    storageService.saveProjects(updatedProjects);
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

    updateProjectProgress(taskData.projectId, updated);

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
  }, [updateProjectProgress]);

  const updateTask = useCallback((id: string, taskData: Partial<Task>) => {
    const currentTasks = storageService.getTasks();
    let projectId = '';
    const updated = currentTasks.map((t) => {
      if (t.id === id) {
        projectId = t.projectId;
        return { ...t, ...taskData };
      }
      return t;
    });

    storageService.saveTasks(updated);
    setTasks(updated);

    if (projectId) {
      updateProjectProgress(projectId, updated);
    }
  }, [updateProjectProgress]);

  const deleteTask = useCallback((id: string) => {
    const currentTasks = storageService.getTasks();
    const taskToDelete = currentTasks.find(t => t.id === id);
    const updated = currentTasks.filter((t) => t.id !== id);

    storageService.saveTasks(updated);
    setTasks(updated);

    if (taskToDelete) {
      updateProjectProgress(taskToDelete.projectId, updated);

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
  }, [updateProjectProgress]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
}
