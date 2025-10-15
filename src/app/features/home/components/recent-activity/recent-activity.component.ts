import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { ButtonModule } from 'primeng/button';
import { ActivityState } from '@core/activity/activity.state';
import { PaginationControlsComponent } from '@shared/components/pagination-controls/pagination-controls.component';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-recent-activity',
  imports: [ActivityListComponent, ButtonModule, PaginationControlsComponent],
  template: `
    <div class="box-container min-h-[655px]">
      <div
        class="pb-6 flex flex-col sm:flex-row justify-between sm:items-center"
      >
        <h1 class="text-xl font-bold">Actividad reciente</h1>
      </div>

      <app-activity-list
        [activities]="paginatedActivities()"
        [loaded]="loaded()"
      />
      <app-pagination-controls
        [first]="first()"
        [rows]="rows()"
        [totalRecords]="activity().length"
        [rowsPerPageOptions]="[]"
        (pageChange)="onPageChange($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityComponent {
  /** Estado inyectado */
  private activityState = inject(ActivityState);
  readonly activity = this.activityState.activity;
  readonly loaded = this.activityState.loaded;

  /** Estado de paginación */
  readonly first = signal(0);
  readonly rows = signal(6);

  /** Array derivado paginado */
  readonly paginatedActivities = computed(() => {
    const start = this.first();
    return this.activity().slice(start, start + this.rows());
  });

  /** Maneja cambios de página desde el paginador */
  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? this.first());
    this.rows.set(event.rows ?? this.rows());
  }
}
