import type { Project, Task } from '../types';

/** Percentage of a project's tasks that are done. A project with no tasks is at 0. */
export function projectProgress(projectId: string, tasks: Task[]): number {
  const own = tasks.filter((t) => t.projectId === projectId);
  if (own.length === 0) return 0;
  return Math.round((own.filter((t) => t.status === 'Done').length / own.length) * 100);
}

/** Projects with their progress recalculated from the tasks. */
export const withProgress = (projects: Project[], tasks: Task[]): Project[] =>
  projects.map((p) => ({ ...p, progress: projectProgress(p.id, tasks) }));
