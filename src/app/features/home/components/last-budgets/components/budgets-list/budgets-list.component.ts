import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Budget } from '@features/budgets/models/budgets.model';
import { BudgetsListItemComponent } from '../budgets-list-item/budgets-list-item.component';

@Component({
  selector: 'app-budgets-list',
  imports: [BudgetsListItemComponent],
  template: `
    <ul class="flex flex-col gap-4 divide-y divide-gray-200">
      @if (!loading()) {
        @for (budget of budgets(); track $index) {
          <li>
            <app-budgets-list-item
              [id]="budget.id"
              [name]="budget.name"
              [clientName]="budget.client_name"
              [price]="budget.total"
              [createdAt]="budget.created_at"
              (onPreview)="onPreview.emit({ budgetId: budget.id })"
            />
          </li>
        } @empty {
          <li class="text-sm text-gray-500">No se han creado presupuestos</li>
        }
      } @else {
        <li class="text-sm text-gray-500">
          <div>
            <i
              class="pi pi-spin pi-spinner text-indigo-600"
              style="font-size: .8rem;"
            ></i>
            <span class="text-base pl-2">Cargando los presupuestos</span>
          </div>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsListComponent {
  budgets = input<Budget[]>([]);
  loading = input<boolean>(false);

  onPreview = output<{ budgetId: number }>();
}
