import { Injectable } from '@angular/core';

import { Task, TaskStatus } from '../models/task.model';

@Injectable()
export class TaskManagementService {
  private readonly localStorageKey = 'tasks';
  private tasks: Task[] = [];

  loadTasks(): void {
    const tasksFromStorage = localStorage.getItem(this.localStorageKey);
    if (tasksFromStorage) {
      this.tasks = JSON.parse(tasksFromStorage);
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(title: string): void {
    const newTask: Task = {
      id: this.generateUniqueId(),
      title,
      status: TaskStatus.progress,
    };

    this.tasks.push(newTask);
    this.saveTasks();
  }

  updateTask(id: number, status: TaskStatus): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      this.saveTasks();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks();
  }

  private saveTasks(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
  }

  private generateUniqueId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map((task) => task.id)) + 1 : 1;
  }
}
