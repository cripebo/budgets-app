import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '@features/clients/models/clients.model';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    MessageModule,
  ],
  template: `
    <form [formGroup]="clientForm" class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-2">
          <label for="client-name">Nombre*</label>
          <input
            pInputText
            id="client-name"
            aria-describedby="client-name-help"
            formControlName="name"
            [attr.aria-describedby]="
              clientForm.controls['name'].touched &&
              clientForm.controls['name'].invalid
                ? 'client-name-error'
                : null
            "
          />
          <p-message
            id="client-name-error"
            [severity]="
              clientForm.controls['name'].touched &&
              clientForm.controls['name'].invalid
                ? 'error'
                : 'secondary'
            "
            styleClass="custom-message"
            variant="simple"
            size="small"
            >{{
              clientForm.controls['name'].touched &&
              clientForm.controls['name'].invalid
                ? 'El nombre del cliente es requerido'
                : 'Introduce el nombre del cliente'
            }}</p-message
          >
        </div>
        <div class="flex flex-col gap-2">
          <label for="client-address">Dirección</label>
          <input
            pInputText
            id="client-address"
            aria-describedby="client-address-help"
            formControlName="address"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label for="client-address">Correo electrónico</label>
            <input
              pInputText
              id="client-email"
              aria-describedby="client-email-help"
              formControlName="email"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="client-phone">Teléfono</label>
            <input
              pInputText
              id="client-phone"
              aria-describedby="client-phone-help"
              formControlName="phone"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2 mt-4">
          <p-message
            class=""
            [severity]="'secondary'"
            styleClass="custom-message"
            variant="simple"
            size="small"
            >* Campos requeridos</p-message
          >
        </div>
      </div>

      <div class="flex justify-end">
        <p-button
          [label]="isEditMode ? 'Editar' : 'Crear'"
          [icon]="isEditMode ? 'pi pi-pencil' : 'pi pi-plus'"
          [disabled]="clientForm.invalid"
          (onClick)="isEditMode ? edit() : create()"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);

  client = input<Client | null>(null);

  clientForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: [''],
    email: [''],
    phone: [''],
  });

  get isEditMode() {
    return !!this.client();
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.clientForm.patchValue(this.client()!);
    }
  }

  create() {
    if (this.clientForm.invalid) return;
    const formValue = this.clientForm.value;

    this.dialogRef.close(formValue);
  }

  edit() {
    if (this.clientForm.invalid) return;
    const formValue = this.clientForm.value;

    this.dialogRef.close({ id: this.client()!.id, ...formValue });
  }
}
