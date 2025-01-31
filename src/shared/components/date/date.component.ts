import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-date',
  imports: [DatePipe],
  standalone: true,
  templateUrl: './date.component.html',
  styleUrl: './date.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateComponent {
  currentDate = new Date();
}
