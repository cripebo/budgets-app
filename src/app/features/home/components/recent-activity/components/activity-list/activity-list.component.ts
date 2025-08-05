import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityListItemComponent } from '../activity-list-item/activity-list-item.component';
import { Activity } from '@core/activity/models/activity.model';

@Component({
  selector: 'app-activity-list',
  imports: [ActivityListItemComponent],
  template: `
    <ul class="flex flex-col divide-y divide-gray-200">
      @if (loaded()) {
        @for (activity of activities(); track $index) {
          <li class="py-2">
            <app-activity-list-item [activity]="activity" />
          </li>
        } @empty {
          <li class="text-sm text-gray-500">No hay actividad reciente</li>
        }
      } @else {
        <li class="text-sm text-gray-500">
          <div>
            <i
              class="pi pi-spin pi-spinner text-indigo-600"
              style="font-size: .8rem;"
            ></i>
            <span class="text-base pl-2">Cargando actividad reciente</span>
          </div>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityListComponent {
  activities = input<Activity[]>([]);
  loaded = input<boolean>(false);
}
