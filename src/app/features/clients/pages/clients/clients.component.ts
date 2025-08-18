import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ClientsService } from '@features/clients/clients.service';
import { ClientsState } from '@features/clients/clients.state';
import { ClientsTableComponent } from '@features/clients/components/clients-table/clients-table.component';
import { ClientsActionsComponent } from '@features/clients/components/clients-actions/clients-actions.component';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { Client } from '@features/clients/models/clients.model';
import { ClientFormComponent } from '../client-form/client-form.component';
import { DeleteClientFormComponent } from '../delete-client-form/delete-client-form.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-clients',
  imports: [ClientsTableComponent, ClientsActionsComponent],
  providers: [DialogService],
  template: `
    <div class="box-container">
      <div class="border-b border-surface flex flex-col gap-4 pb-4">
        <h1 class="text-xl font-bold">Clientes</h1>
        <h3 class="text-sm sm:text-normal font-normal">
          Puede crear y editar los clientes para añadirlos rápidamente a tus
          presupuestos.
        </h3>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row mt-4">
        <div>
          <app-clients-actions (onCreate)="createClientModal()" />
        </div>
        <div class="flex-1">
          <app-clients-table
            [clients]="clients()"
            [loading]="loading()"
            (onEdit)="editClientModal($event)"
            (onDelete)="deleteClientModal($event)"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  private dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | undefined;
  private dialogConf: DynamicDialogConfig = {
    width: '50vw',
    breakpoints: {
      '1024px': '75vw',
      '640px': '80vw',
      '380px': '100%',
    },
    modal: true,
    closable: true,
  };

  private clientService = inject(ClientsService);
  private clientsState = inject(ClientsState);
  protected clients = this.clientsState.clients;
  protected loading = this.clientsState.loading;

  ngOnInit(): void {
    this.clientService.loadAll();
  }

  createClientModal() {
    const header = 'Crear cliente';

    this.dialogRef = this.dialogService.open(ClientFormComponent, {
      header,
      ...this.dialogConf,
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((result: Client) => {
      if (!result) return;

      this.clientService.createClient(result);
    });
  }

  editClientModal(clientId: number) {
    const header = 'Editar cliente';
    const client = this.clientsState.getById(clientId);

    this.dialogRef = this.dialogService.open(ClientFormComponent, {
      header,
      ...this.dialogConf,
      inputValues: { client },
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((result: Client) => {
      if (!result) return;

      this.clientService.updateClient(result);
    });
  }

  deleteClientModal(itemId: number) {
    const header = 'Eliminar cliente';
    const client = this.clientsState.getById(itemId);
    const customDialogConf = {
      width: '30vw',
      breakpoints: {
        '1024px': '60vw',
        '380px': '100%',
      },
    };

    this.dialogRef = this.dialogService.open(DeleteClientFormComponent, {
      header,
      ...this.dialogConf,
      inputValues: { client },
      ...customDialogConf,
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((result: Client) => {
      if (!result) return;

      this.clientService.deleteClient(result.id!);
    });
  }
}
