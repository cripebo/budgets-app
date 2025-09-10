import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ElapsedTimePipe } from '@shared/pipes/elapsed-time.pipe';

@Component({
  selector: 'app-budgets-list-item',
  imports: [CurrencyPipe, ElapsedTimePipe],
  template: `
    <a
      id="budget-info"
      class="flex flex-row justify-between pb-2 hover:bg-gray-50 hover:cursor-pointer"
      (click)="onPreview.emit()"
    >
      <div class="flex-1">
        <h3 class="budget-info--title text-base line-clamp-1" [title]="name()">
          {{ name() }}
        </h3>
        <div class="text-sm text-gray-600">
          {{ clientName() }}
        </div>
        <p class="pt-2 text-emerald-700 text-base font-semibold">
          {{ price() | currency: 'EUR' : 'symbol' }}
        </p>
      </div>
      <p class="w-30 pl-8 text-sm text-gray-500">
        {{ createdAt() | elapsedTime }}
      </p>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsListItemComponent {
  private NO_CLIENT_LABEL = 'Sin cliente';

  id = input.required<number>();
  name = input.required<string>();
  price = input.required<number>();
  createdAt = input.required<string>();
  clientName = input(this.NO_CLIENT_LABEL, {
    transform: (value: string) => {
      return value?.trim().length ? value : this.NO_CLIENT_LABEL;
    },
  });

  onPreview = output();
}
