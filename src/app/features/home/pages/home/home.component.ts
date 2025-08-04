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

@Component({
  selector: 'app-home',
  imports: [MenubarModule, GeneralViewComponent, LastBudgetsComponent],
  template: `
    <div class="flex flex-col gap-2">
      <app-general-view />
      <div class="grid lg:grid-cols-2 gap-2">
        <article>
          <app-last-budgets />
        </article>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private budgetsService = inject(BudgetsService);

  ngOnInit(): void {
    this.budgetsService.loadAll();
  }
}
