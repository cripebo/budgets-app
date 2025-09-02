import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientSelectListComponent } from '@features/clients/components/client-select-list/client-select-list.component';
import { Client } from '@features/clients/models/clients.model';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-client-form-fields',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  providers: [DialogService],
  template: `
    <section [formGroup]="parentFormGroup()">
      <div formGroupName="client" class="flex flex-col gap-4 pb-8">
        <h3 for="client-name" class="font-semibold text-xl">
          Datos sobre el cliente
        </h3>

        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <label for="client-name">Nombre</label>
            <div class="flex flex-row gap-2">
              <input
                pInputText
                id="client-name"
                aria-describedby="client-name-help"
                formControlName="client-name"
                class="flex-1"
              />
              <p-button
                [label]="'Cliente'"
                [icon]="'pi pi-user'"
                [outlined]="true"
                (onClick)="selectClient()"
                ariaLabel="Seleccionar cliente"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="client-address">Dirección</label>
            <input
              pInputText
              id="client-address"
              aria-describedby="client-address-help"
              formControlName="client-address"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label for="client-phone">Teléfono</label>
              <input
                pInputText
                id="client-phone"
                aria-describedby="client-phone-help"
                formControlName="client-phone"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="client-email">Correo eletrónico</label>
              <input
                pInputText
                id="client-email"
                aria-describedby="client-email-help"
                formControlName="client-email"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormFieldsComponent extends ModalHandler {
  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  parentFormGroup = input.required<FormGroup>();

  selectClient() {
    this.openModal(ClientSelectListComponent, {
      header: 'Selecciona un cliente',

      onClose: (selectedClient: Client) => {
        if (selectedClient) this.setClient(selectedClient);
      },
    });
  }

  setClient(client: Client) {
    const clientParsed = {
      'client-name': client.name,
      'client-address': client.address,
      'client-phone': client.phone,
      'client-email': client.email,
    };

    this.parentFormGroup().patchValue({ client: clientParsed });
  }
}
