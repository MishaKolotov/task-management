import { effect, Injectable, signal } from '@angular/core';

import { Task, TaskStatus } from '../models/task.model';

@Injectable()
export class TaskManagementService {
  private readonly localStorageKey = 'tasks';
  private tasksByStatus = signal({
    [TaskStatus.progress]: [] as Task[],
    [TaskStatus.postponed]: [] as Task[],
    [TaskStatus.completed]: [] as Task[],
  });

  readonly allTasks = signal<Task[]>([]);

  constructor() {
    effect(() => {
      const tasksByStatus = this.tasksByStatus();

      localStorage.setItem(this.localStorageKey, JSON.stringify(tasksByStatus));

      const allTasks = [
        ...tasksByStatus[TaskStatus.progress],
        ...tasksByStatus[TaskStatus.postponed],
        ...tasksByStatus[TaskStatus.completed],
      ];
      this.allTasks.set(allTasks);

      console.log(this.tasksByStatus())
    });
  }

  loadTasks(): void {
    const storedData = localStorage.getItem(this.localStorageKey);

    if (storedData) {
      this.tasksByStatus.set(JSON.parse(storedData));
    }
  }

  getTasksByStatus(status: TaskStatus, filterText: string = ''): Task[] {
    const tasks = this.tasksByStatus()[status];

    if (!filterText.trim()) {
      return tasks;
    }

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  addTask(title: string): void {
    const newTask: Task = {
      id: this.generateUniqueId(),
      title,
      status: TaskStatus.progress,
    };

    this.tasksByStatus.update((tasks) => {
      return { ...tasks, [TaskStatus.progress]: [...tasks[TaskStatus.progress], newTask] };
    });
  }

  moveTask(taskId: number, newStatus: TaskStatus): void {
    const task = this.allTasks().find((t) => t.id === taskId);

    if (task) {
      this.tasksByStatus.update((tasks) => {
        tasks[task.status] = tasks[task.status].filter((t) => t.id !== taskId);
        tasks[newStatus] = [...tasks[newStatus], { ...task, status: newStatus }];

        return { ...tasks };
      });
    }
  }

  deleteTask(taskId: number): void {
    this.tasksByStatus.update((tasks) => {
      const updatedTasks = { ...tasks };

      Object.values(TaskStatus).forEach((status) => {
        updatedTasks[status] = tasks[status].filter((t) => t.id !== taskId);
      });

      return updatedTasks;
    });
  }

  resetAllItems(): void {
    this.tasksByStatus.set({
      [TaskStatus.progress]: [],
      [TaskStatus.postponed]: [],
      [TaskStatus.completed]: [],
    });

    localStorage.removeItem(this.localStorageKey);
  }

  updateTaskOrder(status: TaskStatus, orderedTasks: Task[]): void {
    this.tasksByStatus.update((tasks) => {
      const updatedTasks = { ...tasks, [status]: [...orderedTasks] };
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
      return { ...updatedTasks };
    });
  }

  private generateUniqueId(): number {
    return this.allTasks().length > 0
      ? Math.max(...this.allTasks().map((task) => task.id)) + 1
      : 1;
  }
}
