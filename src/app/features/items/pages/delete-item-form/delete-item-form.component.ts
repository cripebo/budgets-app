import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Item } from '@features/items/models/items.model';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-item-form',
  imports: [ButtonModule],
  template: `
    <p class="p-text-secondary block mb-8">
      Seguro que quieres eliminar el concepto
      <span class="font-bold"> {{ item()?.name }}</span>
    </p>
    <div class="flex justify-end gap-2">
      <p-button label="Cancelar" severity="secondary" (onClick)="onCancel()" />
      <p-button
        label="Borrar"
        severity="danger"
        icon="pi pi-trash"
        (onClick)="onDelete()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteItemFormComponent {
  dialogRef = inject(DynamicDialogRef);
  item = input<Item | null>(null);

  onCancel() {
    this.dialogRef.close();
  }
  onDelete() {
    this.dialogRef.close(this.item()!);
  }
}
