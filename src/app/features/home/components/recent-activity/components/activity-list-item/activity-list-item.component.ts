import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ActivityLabelService } from '@core/activity/labels/activity-label.service';
import { Activity } from '@core/activity/models/activity.model';
import { ElapsedTimePipe } from '@shared/pipes/elapsed-time.pipe';
import { ActivityActionIconComponent } from '../activity-action-icon/activity-action-icon.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-list-item',
  imports: [ElapsedTimePipe, DatePipe, ActivityActionIconComponent],
  template: `
    <div class="flex justify-between py-2 rounded items-center">
      <div class="flex-1">
        <div class="line-clamp-1 flex items-start gap-3">
          <app-activity-action-icon [action]="activity().action" />
          <p class="line-clamp-2">
            {{ activityLabelService.getLabel(activity())?.prefix }}
            <span class="font-semibold">{{ activity().name }}</span>
          </p>
        </div>
      </div>
      <p
        class="w-30 pl-8 text-left text-sm text-gray-500"
        [title]="activity().created_at | date: 'd/M/yyyy, HH:mm'"
      >
        {{ activity().created_at | elapsedTime }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListItemComponent {
  protected activityLabelService = inject(ActivityLabelService);

  activity = input.required<Activity>();
}
