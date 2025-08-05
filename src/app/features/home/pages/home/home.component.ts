import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { GeneralViewComponent } from '../../components/general-view/general-view.component';
import { BudgetsService } from '@features/budgets/budgets.service';
import { LastBudgetsComponent } from '@features/home/components/last-budgets/last-budgets.component';
import { RecentActivityComponent } from '@features/home/components/recent-activity/recent-activity.component';
import { ActivityService } from '@core/activity/activity.service';

@Component({
  selector: 'app-home',
  imports: [
    MenubarModule,
    GeneralViewComponent,
    LastBudgetsComponent,
    RecentActivityComponent,
  ],
  template: `
    <div class="flex flex-col gap-2">
      <app-general-view />
      <div class="grid lg:grid-cols-2 gap-2">
        <article>
          <app-last-budgets />
        </article>
        <article>
          <app-recent-activity />
        </article>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private budgetsService = inject(BudgetsService);
  private activityService = inject(ActivityService);

  ngOnInit(): void {
    this.budgetsService.loadAll();
    this.activityService.loadAll();
  }
}
