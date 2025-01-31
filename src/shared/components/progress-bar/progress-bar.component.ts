import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

export interface ProgressSegment<T> {
  label: string;
  color: string;
  filterFn: (item: T) => boolean;
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent<T> implements OnChanges {
  @Input() items: T[] = [];
  @Input() segments: ProgressSegment<T>[] = [];

  progressSegments: { color: string; percentage: number }[] = [];

  ngOnChanges(): void {
    this.calculateProgress();
  }

  private calculateProgress(): void {
    const total = this.items.length;
    this.progressSegments = this.segments.map((segment) => {
      const count = this.items.filter(segment.filterFn).length;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return { color: segment.color, percentage };
    });
  }
}
