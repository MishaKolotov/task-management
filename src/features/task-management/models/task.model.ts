export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export enum TaskStatus {
  progress = 'in-progress',
  postponed = 'postponed',
  completed = 'completed',
}
