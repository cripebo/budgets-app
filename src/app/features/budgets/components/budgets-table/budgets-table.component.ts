import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EmptyFallbackPipe } from '@shared/pipes/empty-fallback.pipe';
import { Budget } from '@features/budgets/models/budgets.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BudgetsTableActionsComponent } from './components/budgets-table-actions/budgets-table-actions.component';
import { BudgetsTableStateWithActionComponent } from './components/budgets-table-state-with-action/budgets-table-state-with-action.component';
import { State } from '@features/states/models/states.model';

@Component({
  selector: 'app-budgets-table',
  imports: [
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    EmptyFallbackPipe,
    DatePipe,
    CurrencyPipe,
    BudgetsTableActionsComponent,
    BudgetsTableStateWithActionComponent,
  ],
  template: `
    <p-table
      #table
      [value]="budgets()"
      stripedRows
      size="small"
      [globalFilterFields]="['name', 'total', 'status.name']"
      sortField="created_at"
      [sortOrder]="-1"
      [loading]="loading()"
      [showLoader]="false"
      [paginator]="true"
      [rows]="5"
    >
      <ng-template #caption>
        <div class="flex -mx-2">
          <p-iconfield iconPosition="left" class="w-full sm:w-[300px]">
            <p-inputicon>
              <i class="pi pi-search"></i>
            </p-inputicon>
            <input
              class="w-full"
              pInputText
              pSize="small"
              type="text"
              (input)="onFilter($event)"
              placeholder="Buscar"
            />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th class="w-2/6">Nombre</th>
          <th>Cliente</th>
          <th pSortableColumn="created_at">
            Creado<p-sortIcon field="created_at" />
          </th>
          <th pSortableColumn="total">Precio<p-sortIcon field="total" /></th>
          <th>Estado</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-budget>
        <tr>
          <td>
            <p class="line-clamp-2" [title]="budget.name">{{ budget.name }}</p>
          </td>
          <td>{{ budget.client_name | emptyFallback }}</td>
          <td>{{ budget.created_at | date: 'd/MM/yyyy' }}</td>
          <td class="text-emerald-700 text-base font-semibold">
            {{ budget.total | currency: 'EUR' : 'symbol' }}
          </td>
          <td>
            <app-budgets-table-state-with-action
              [activeState]="budget.status"
              (onChangedState)="
                onChangeState.emit({ budgetId: budget.id, newStateId: $event })
              "
            />
          </td>
          <td>
            <div>
              <app-budgets-table-actions />
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template #loadingbody>
        <tr>
          <td [colSpan]="5">
            <div class="h-14 grid items-center justify-center">
              <p class="flex flex-row items-center gap-2">
                <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
                <span>Cargando presupuestos</span>
              </p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    :host ::ng-deep .p-sortable-column-icon {
      width: 0.7rem;
      transform: translateY(3px) translateX(3px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsTableComponent {
  budgets = input<Budget[]>([]);
  loading = input(false);
  table = viewChild<Table>('table');

  onChangeState = output<{ budgetId: number; newStateId: number }>();

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value, 'contains');
  }
}
