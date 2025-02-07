import { Signal } from '@angular/core';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
}

export enum TaskStatus {
  progress = 'in-progress',
  postponed = 'postponed',
  completed = 'completed',
}

export type TaskPanel = {
  title: string;
  status: TaskStatus;
  tasks: Signal<Task[]>;
  connectedToPanels: TaskStatus[];
};
