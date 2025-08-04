import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BudgetsState } from '@features/budgets/budgets.state';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BudgetsListComponent } from './components/budgets-list/budgets-list.component';

@Component({
  selector: 'app-last-budgets',
  imports: [RouterLink, ButtonModule, BudgetsListComponent],
  template: `
    <div class="box-container">
      <div
        class="pb-6 flex flex-col sm:flex-row justify-between sm:items-center"
      >
        <h1 class="text-xl font-bold">Últimos presupuestos</h1>
        <a [routerLink]="['/budgets']">
          <p-button
            label="Mostrar todos"
            size="small"
            [severity]="'secondary'"
          />
        </a>
      </div>
      <app-budgets-list [budgets]="budgets()" [loaded]="loaded()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastBudgetsComponent {
  budgetsState = inject(BudgetsState);
  budgets = this.budgetsState.budgets;
  loaded = this.budgetsState.loaded;
}
