import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ItemCategory } from '@features/items/models/items.model';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-category-modal',
  imports: [ButtonModule],
  template: `
    <p class="p-text-secondary block mb-8">
      Seguro que quieres eliminar la categoría
      <span class="font-bold"> {{ category().name }}</span>
    </p>
    <p class="text-sm italic block mb-8 text-red-500">
      Si eliminas esta categoría, los conceptos asociados dejarán de tener
      categoría.
    </p>
    <div class="flex justify-end gap-2">
      <p-button label="Cancelar" severity="secondary" (onClick)="cancel()" />
      <p-button
        label="Borrar"
        severity="danger"
        icon="pi pi-trash"
        (onClick)="confirmDelete()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCategoryModalComponent {
  dialogRef = inject(DynamicDialogRef);
  category = input.required<ItemCategory>();

  cancel() {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.dialogRef.close(this.category()!);
  }
}
