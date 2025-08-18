import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Client } from '@features/clients/models/clients.model';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-client-form',
  imports: [ButtonModule],
  template: `
    <div
      role="alertdialog"
      aria-labelledby="deleteClientTitle"
      aria-modal="true"
    >
      <h2 id="deleteClientTitle" class="mb-8 text-base font-normal">
        ¿Seguro que quieres eliminar el cliente
        <span class="font-bold">{{ client().name }}</span
        >?
      </h2>

      <div class="flex justify-end gap-2">
        <p-button
          label="Cancelar"
          severity="secondary"
          (onClick)="onCancel()"
        />
        <p-button
          label="Borrar"
          severity="danger"
          icon="pi pi-trash"
          (onClick)="onDelete()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteClientFormComponent {
  dialogRef = inject(DynamicDialogRef);

  client = input.required<Client>();

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.dialogRef.close(this.client()!);
  }
}
