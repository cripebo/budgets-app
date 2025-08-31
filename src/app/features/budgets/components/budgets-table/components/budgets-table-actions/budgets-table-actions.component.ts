import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-budgets-table-actions',
  imports: [ButtonModule],
  template: `
    <div class="flex gap-2">
      <p-button
        size="small"
        icon="pi pi-trash"
        [rounded]="true"
        severity="secondary"
        (onClick)="onDelete.emit()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsTableActionsComponent {
  onDelete = output();
}
