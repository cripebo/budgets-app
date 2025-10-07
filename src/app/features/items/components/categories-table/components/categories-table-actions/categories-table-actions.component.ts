import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-categories-table-actions',
  imports: [ButtonModule],
  template: `
    <div class="flex gap-2">
      @if (!editing()) {
        <p-button
          size="small"
          icon="pi pi-pencil"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          (onClick)="onEdit.emit()"
        />

        <p-button
          size="small"
          icon="pi pi-trash"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          (onClick)="onDelete.emit()"
        />
      } @else {
        <p-button
          size="small"
          icon="pi pi-check"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          (onClick)="onConfirmEdit.emit()"
          [disabled]="disableConfirm()"
        />

        <p-button
          size="small"
          icon="pi pi-times"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          (onClick)="onCancelEdit.emit()"
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesTableActionsComponent {
  editing = input(false);
  disableConfirm = input(false);

  onEdit = output();
  onDelete = output();
  onConfirmEdit = output();
  onCancelEdit = output();
}
