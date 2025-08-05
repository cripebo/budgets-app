import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { ButtonModule } from 'primeng/button';
import { ActivityState } from '@core/activity/activity.state';

@Component({
  selector: 'app-recent-activity',
  imports: [ActivityListComponent, ButtonModule],
  template: `
    <div class="box-container">
      <div
        class="pb-6 flex flex-col sm:flex-row justify-between sm:items-center"
      >
        <h1 class="text-xl font-bold">Actividad reciente</h1>
        <a>
          <p-button label="Ver más" size="small" [severity]="'secondary'" />
        </a>
      </div>
      <app-activity-list [activities]="activity()" [loaded]="loaded()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityComponent {
  activityState = inject(ActivityState);
  activity = this.activityState.activity;
  loaded = this.activityState.loaded;
}
