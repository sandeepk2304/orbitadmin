import { useState, useCallback } from 'react';
import type { Project } from '../types';
import { storageService } from '../services/storageService';

/**
 * Custom Hook: useProjects
 * 
 * Purpose:
 * Moves projects state operations and logs into a dedicated hook.
 * 
 * Usage:
 * ```tsx
 * const { projects, addProject, updateProject, deleteProject } = useProjects();
 * ```
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => storageService.getProjects());

  const addProject = useCallback((projectData: Omit<Project, 'id' | 'progress'>) => {
    const currentProjects = storageService.getProjects();
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      progress: 0,
    };

    const updated = [...currentProjects, newProject];
    storageService.saveProjects(updated);
    setProjects(updated);

    // Add activity log
    const activities = storageService.getActivities();
    storageService.saveActivities([
      {
        id: `a-${Date.now()}`,
        icon: '📁',
        color: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-500',
        text: 'New Project Registered',
        sub: `Created project plan for "${newProject.name}".`,
        by: 'Admin',
        time: 'Just now',
      },
      ...activities,
    ]);

    return newProject;
  }, []);

  const updateProject = useCallback((id: string, projectData: Partial<Project>) => {
    const currentProjects = storageService.getProjects();
    const updated = currentProjects.map((p) => {
      if (p.id === id) {
        return { ...p, ...projectData };
      }
      return p;
    });

    storageService.saveProjects(updated);
    setProjects(updated);
  }, []);

  const deleteProject = useCallback((id: string) => {
    const currentProjects = storageService.getProjects();
    const projectToDelete = currentProjects.find(p => p.id === id);
    const updated = currentProjects.filter((p) => p.id !== id);

    storageService.saveProjects(updated);
    setProjects(updated);

    if (projectToDelete) {
      // Add activity log
      const activities = storageService.getActivities();
      storageService.saveActivities([
        {
          id: `a-${Date.now()}`,
          icon: '🗑️',
          color: 'bg-red-100 dark:bg-red-500/15 text-red-500',
          text: 'Project Removed',
          sub: `Deleted project folder for "${projectToDelete.name}".`,
          by: 'Admin',
          time: 'Just now',
        },
        ...activities,
      ]);
    }
  }, []);

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };
}
