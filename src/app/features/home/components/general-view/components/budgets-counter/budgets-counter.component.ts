import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-budgets-counter',
  imports: [],
  template: `<h2 class="text-xl font-semibold">
      <i class="pi pi-file text-blue-600" style="font-size: 1.1rem;"></i>
      Presupuestos
    </h2>
    <div>
      <p class="font-normal text-gray-600">{{ budgetsCounter() }} creados</p>
    </div>`,
  styleUrl: './budgets-counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsCounterComponent {
  budgetsCounter = input(0);
}
