import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-states-table-actions',
  imports: [ButtonModule],
  template: `<div class="flex gap-2">
    <p-button
      size="small"
      icon="pi pi-pencil"
      [rounded]="true"
      [text]="true"
      severity="secondary"
      (onClick)="onEdit.emit()"
    />

    @if (canRemove()) {
      <p-button
        size="small"
        icon="pi pi-trash"
        [rounded]="true"
        [text]="true"
        severity="secondary"
        (onClick)="onDelete.emit()"
      />
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatesTableActionsComponent {
  canRemove = input<boolean>(true);

  onEdit = output();
  onDelete = output();
}
