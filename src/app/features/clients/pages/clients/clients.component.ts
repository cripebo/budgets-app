import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ClientsService } from '@features/clients/clients.service';
import { ClientsState } from '@features/clients/clients.state';
import { ClientsTableComponent } from '@features/clients/components/clients-table/clients-table.component';
import { ClientsActionsComponent } from '@features/clients/components/clients-actions/clients-actions.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Client } from '@features/clients/models/clients.model';
import { ClientFormComponent } from '../client-form/client-form.component';
import { DeleteClientFormComponent } from '../delete-client-form/delete-client-form.component';
import { ModalHandler } from '@shared/modals/modal-handler';
import { ExportService } from '@core/export/services/export.service';
import { ExportFormat } from '@core/export/models/export-format.enum';
import { downloadBlob } from '@shared/utils/file-downloader';

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
            [exporting]="exporting()"
            (onEdit)="editClientModal($event)"
            (onDelete)="deleteClientModal($event)"
            (onExport)="export()"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent extends ModalHandler implements OnInit {
  private clientService = inject(ClientsService);
  private clientsState = inject(ClientsState);
  private exportService = inject(ExportService);
  protected clients = this.clientsState.clients;
  protected loading = this.clientsState.loading;
  protected exporting = signal(false);

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.clientService.loadAll();
  }

  createClientModal() {
    this.openModal(ClientFormComponent, {
      header: 'Crear cliente',
      onClose: (result: Client) => {
        if (result) this.clientService.createClient(result);
      },
    });
  }

  editClientModal(clientId: number) {
    const client = this.clientsState.getById(clientId);

    this.openModal(ClientFormComponent, {
      header: 'Editar cliente',
      inputValues: { client },
      onClose: (result: Client) => {
        if (result) this.clientService.updateClient(result);
      },
    });
  }

  deleteClientModal(itemId: number) {
    const client = this.clientsState.getById(itemId);

    this.openModal(DeleteClientFormComponent, {
      header: 'Eliminar cliente',
      inputValues: { client },
      width: '30vw',
      onClose: (result: Client) => {
        if (result) this.clientService.deleteClient(result.id!);
      },
    });
  }

  export() {
    const entity = 'clients';
    this.exporting.set(true);

    this.exportService.export(entity, ExportFormat.CSV).subscribe({
      next: (blob) => downloadBlob(blob, `${entity}.csv`),
      error: (err) => console.error('Error exportando', err),
      complete: () => this.exporting.set(false),
    });
  }
}
