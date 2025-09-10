import { BudgetsService } from '@features/budgets/budgets.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BudgetsState } from '@features/budgets/budgets.state';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BudgetsListComponent } from './components/budgets-list/budgets-list.component';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { BudgetPreviewComponent } from '@features/budgets/components/budget-preview/budget-preview.component';
import { PaginationControlsComponent } from '@shared/components/pagination-controls/pagination-controls.component';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-last-budgets',
  imports: [
    RouterLink,
    ButtonModule,
    BudgetsListComponent,
    PaginationControlsComponent,
  ],
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
        [budgets]="paginatedBudgets()"
        [loading]="loading()"
        (onPreview)="previewBudget($event)"
      />

      <app-pagination-controls
        [first]="first()"
        [rows]="rows()"
        [totalRecords]="budgets().length"
        [rowsPerPageOptions]="[]"
        (pageChange)="onPageChange($event)"
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

  readonly first = signal(0);
  readonly rows = signal(5);

  readonly paginatedBudgets = computed(() => {
    const start = this.first();
    return this.budgets().slice(start, start + this.rows());
  });

  onPageChange(event: PaginatorState) {
    this.first.set(event.first ?? this.first());
    this.rows.set(event.rows ?? this.rows());
  }

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
