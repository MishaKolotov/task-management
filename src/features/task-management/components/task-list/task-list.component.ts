import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';

import { DateComponent } from '../../../../shared/components/date/date.component';
import {
  ProgressBarComponent,
  ProgressSegment,
} from '../../../../shared/components/progress-bar/progress-bar.component';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskManagementService } from '../../services/task-management.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatList,
    MatExpansionPanelHeader,
    MatListItem,
    MatFormField,
    MatLabel,
    MatExpansionPanelTitle,
    MatIcon,
    MatInput,
    MatIconButton,
    FormsModule,
    NgTemplateOutlet,
    MatSuffix,
    ProgressBarComponent,
    DateComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less'],
  providers: [TaskManagementService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  newTaskTitle = '';
  filterText = '';
  taskProgressSegments: ProgressSegment<Task>[] = [
    {
      label: 'Completed',
      color: 'var(--completed-color)',
      filterFn: (task) => task.status === TaskStatus.completed,
    },
    {
      label: 'Later',
      color: 'var(--postponed-color)',
      filterFn: (task) => task.status === TaskStatus.postponed,
    },
    {
      label: 'In Progress',
      color: 'var(--background-color)',
      filterFn: (task) => task.status === TaskStatus.progress,
    },
  ];

  readonly TaskStatus = TaskStatus;

  @ViewChild('progressPanel') progressPanel!: MatExpansionPanel;

  constructor(private taskManagementService: TaskManagementService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  get progressTasks(): Task[] {
    return this.filteredTasks.filter(
      (task) => task.status === TaskStatus.progress
    );
  }

  get postponedTasks(): Task[] {
    return this.filteredTasks.filter(
      (task) => task.status === TaskStatus.postponed
    );
  }

  get completedTasks(): Task[] {
    return this.filteredTasks.filter(
      (task) => task.status === TaskStatus.completed
    );
  }

  private loadTasks(): void {
    this.taskManagementService.loadTasks();
    this.tasks = this.taskManagementService.getTasks();
    this.filteredTasks = [...this.tasks];
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskManagementService.addTask(this.newTaskTitle.trim());
      this.newTaskTitle = '';
      this.refreshTasks();
      this.openProgressAccordion();
    }
  }

  applyFilter(): void {
    const search = this.filterText.toLowerCase().trim();
    this.filteredTasks = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(search)
    );
  }

  completeTask(task: Task): void {
    this.taskManagementService.updateTask(task.id, TaskStatus.completed);
    this.refreshTasks();
  }

  postponeTask(task: Task): void {
    this.taskManagementService.updateTask(task.id, TaskStatus.postponed);
    this.refreshTasks();
  }

  deleteTask(task: Task): void {
    this.taskManagementService.deleteTask(task.id);
    this.refreshTasks();
  }

  private refreshTasks(): void {
    this.tasks = [...this.taskManagementService.getTasks()];
    this.applyFilter();
  }

  private openProgressAccordion(): void {
    if (this.progressPanel.expanded) {
      return;
    }

    this.progressPanel.open();
  }
}
