import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-budgets-actions',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col gap-4">
      <p-button
        label="Crear presupuesto"
        icon="pi pi-plus"
        class="mt-1.5"
        aria-label="Crear presupuesto"
        (onClick)="onCreate.emit()"
        styleClass="w-fit sm:w-50"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsActionsComponent {
  onCreate = output();
}
