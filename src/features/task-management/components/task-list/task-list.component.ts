import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { DateComponent } from '../../../../shared/components/date/date.component';
import {
  ProgressBarComponent,
  ProgressSegment,
} from '../../../../shared/components/progress-bar/progress-bar.component';
import { uniqueValidator } from '../../../../shared/utils/validators/unique.validator';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskManagementService } from '../../services/task-management.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatFormField,
    MatLabel,
    MatExpansionPanelTitle,
    MatIcon,
    MatInput,
    MatIconButton,
    MatError,
    FormsModule,
    MatSuffix,
    ProgressBarComponent,
    DateComponent,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    CdkDragPlaceholder,
    MatButton,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.less'],
  providers: [TaskManagementService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  readonly allTasks = signal<Task[]>([]);
  readonly filterText = signal('');
  readonly progressTasks = computed(() =>
    this.taskManagementService.getTasksByStatus(
      TaskStatus.progress,
      this.filterText()
    )
  );
  readonly postponedTasks = computed(() =>
    this.taskManagementService.getTasksByStatus(
      TaskStatus.postponed,
      this.filterText()
    )
  );
  readonly completedTasks = computed(() =>
    this.taskManagementService.getTasksByStatus(
      TaskStatus.completed,
      this.filterText()
    )
  );
  readonly addControl = new FormControl('', {
    validators: [uniqueValidator(this.allTasks)],
  });
  readonly taskProgressSegments: ProgressSegment<Task>[] = [
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

  constructor(private taskManagementService: TaskManagementService) {
    this.syncAllTasks();
  }

  ngOnInit(): void {
    this.taskManagementService.loadTasks();
  }

  onFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.filterText.set(inputElement.value);
  }

  addTask(): void {
    if (!this.addControl.valid) {
      this.addControl.markAsTouched();

      return;
    }

    const title = this.addControl.value?.trim();

    if (title) {
      this.taskManagementService.addTask(title);

      this.addControl.reset();
    }
  }

  deleteTask(taskId: number): void {
    this.taskManagementService.deleteTask(taskId);
  }

  moveTask(taskId: number, newStatus: TaskStatus): void {
    this.taskManagementService.moveTask(taskId, newStatus);
  }

  mouseEnterHandler(
    event: MouseEvent,
    chapterExpansionPanel: MatExpansionPanel
  ): void {
    if (event.buttons && !chapterExpansionPanel.expanded) {
      chapterExpansionPanel.open();
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = event.container.id as TaskStatus;
    const previousStatus = event.previousContainer.id as TaskStatus;

    if (event.previousContainer !== event.container) {
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, task);

      this.taskManagementService.moveTask(task.id, newStatus);
      this.taskManagementService.updateTaskOrder(
        newStatus,
        event.container.data
      );
      this.taskManagementService.updateTaskOrder(
        previousStatus,
        event.previousContainer.data
      );

      return;
    }

    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.taskManagementService.updateTaskOrder(newStatus, event.container.data);
  }

  resetAllItems(): void {
    this.taskManagementService.resetAllItems();
  }

  private syncAllTasks(): void {
    effect(() => {
      this.allTasks.set(this.taskManagementService.allTasks());
    });
  }
}
