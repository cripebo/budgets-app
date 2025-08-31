import { ItemsService } from '@features/items/items.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BudgetsService } from '@features/budgets/budgets.service';
import { BudgetsState } from '@features/budgets/budgets.state';
import { BudgetsActionsComponent } from '@features/budgets/components/budgets-actions/budgets-actions.component';
import { BudgetsTableComponent } from '@features/budgets/components/budgets-table/budgets-table.component';
import { StatesService } from '@features/states/states.service';
import { StatesState } from '@features/states/states.state';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

interface BudgetStateChangeEvent {
  budgetId: number;
  newStateId: number;
}

@Component({
  selector: 'app-budgets',
  imports: [BudgetsActionsComponent, BudgetsTableComponent],
  providers: [DialogService],
  template: `
    <div class="box-container">
      <div class="border-b border-surface flex flex-col gap-4 pb-4">
        <h1 class="text-xl font-bold">Presupuestos</h1>
        <h3 class="text-sm sm:text-normal font-normal">
          Puede crear y gestionar los presupuestos de sus clientes en esta
          página
        </h3>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row mt-4">
        <div>
          <app-budgets-actions (onCreate)="navigateToCreateBudget()" />
        </div>
        <div class="flex-1">
          <app-budgets-table
            [loading]="loading()"
            [budgets]="budgets()"
            (onChangeState)="changeBudgetState($event)"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsComponent extends ModalHandler implements OnInit {
  private readonly router = inject(Router);
  private readonly budgetService = inject(BudgetsService);
  private readonly budgetsState = inject(BudgetsState);
  private readonly statesService = inject(StatesService);
  private readonly statesState = inject(StatesState);
  private readonly itemsService = inject(ItemsService);

  readonly budgets = this.budgetsState.budgets;
  readonly loading = this.budgetsState.loading;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  navigateToCreateBudget(): void {
    this.router.navigate(['/budgets/budget-form']);
  }

  changeBudgetState(event: BudgetStateChangeEvent) {
    if (!event?.budgetId || !event?.newStateId) return;

    const state = this.statesState.getById(event.newStateId);
    if (!state) {
      console.warn(`Estado con ID ${event.newStateId} no encontrado`);
      return;
    }

    this.budgetService.changeStatus(event.budgetId, state);
  }

  private loadInitialData(): void {
    this.budgetService.loadAll();
    this.statesService.loadAll();
    this.itemsService.loadAll();
  }
}
