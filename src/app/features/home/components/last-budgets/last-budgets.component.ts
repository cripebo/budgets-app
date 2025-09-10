import { BudgetsService } from '@features/budgets/budgets.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BudgetsState } from '@features/budgets/budgets.state';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BudgetsListComponent } from './components/budgets-list/budgets-list.component';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { BudgetPreviewComponent } from '@features/budgets/components/budget-preview/budget-preview.component';

@Component({
  selector: 'app-last-budgets',
  imports: [RouterLink, ButtonModule, BudgetsListComponent],
  providers: [DialogService],
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
      <app-budgets-list
        [budgets]="budgets()"
        [loading]="loading()"
        (onPreview)="previewBudget($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastBudgetsComponent extends ModalHandler {
  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  private readonly budgetsService = inject(BudgetsService);
  private readonly budgetsState = inject(BudgetsState);
  readonly budgets = this.budgetsState.budgets;
  readonly loading = this.budgetsState.loading;

  previewBudget(event: { budgetId: number }) {
    const budget = this.budgetsState.getById(event.budgetId);
    this.budgetsService.loadDetailsById(event.budgetId);
    this.openModal(BudgetPreviewComponent, {
      header: '',
      inputValues: { budget },
      width: '70vw',
      breakpoints: {
        '1040px': '100%',
      },
    });
  }
}
