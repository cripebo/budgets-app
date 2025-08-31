import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BudgetsCounterComponent } from './components/budgets-counter/budgets-counter.component';
import { ClientsCounterComponent } from './components/clients-counter/clients-counter.component';
import { BudgetsState } from '@features/budgets/budgets.state';
import { ClientsState } from '@features/clients/clients.state';

@Component({
  selector: 'app-general-view',
  imports: [BudgetsCounterComponent, ClientsCounterComponent],
  template: `
    <div class="box-container">
      <h1 class="text-xl font-bold pb-6">Resumen</h1>
      <div class="grid md:grid-cols-2 lg:gap-0 gap-4">
        <app-budgets-counter [budgetsCounter]="budgets().length" />
        <app-clients-counter [clientsCounter]="clients().length" />
      </div>
    </div>
  `,
  styleUrl: './general-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralViewComponent {
  private readonly budgetsState = inject(BudgetsState);
  private readonly clientsState = inject(ClientsState);
  readonly budgets = this.budgetsState.budgets;
  readonly clients = this.clientsState.clients;
}
