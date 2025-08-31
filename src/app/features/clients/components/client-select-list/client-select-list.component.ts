import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ClientsService } from '@features/clients/clients.service';
import { ClientsState } from '@features/clients/clients.state';
import { Client } from '@features/clients/models/clients.model';
import { EmptyFallbackPipe } from '@shared/pipes/empty-fallback.pipe';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-client-select-list',
  imports: [TableModule, ButtonModule, EmptyFallbackPipe],
  template: `
    <p-table [value]="clients()" [paginator]="true" [rows]="5">
      <ng-template #header>
        <tr>
          <th class="w-1/2">Cliente</th>
          <th>Contacto</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-client>
        <tr>
          <td>
            <div>
              <p class="font-bold">{{ client.name }}</p>
              <p>
                <i class="pi pi-map-marker" style="font-size: .8rem"></i>
                {{ client.address | emptyFallback }}
              </p>
            </div>
          </td>
          <td>
            <div>
              <div class="flex flex-row gap-2 items-center">
                <i
                  class="pi pi-phone translate-y-0.5"
                  style="font-size: .8rem"
                ></i>
                <p>{{ client.phone | emptyFallback }}</p>
              </div>
              <div class="flex flex-row gap-2 items-center">
                <i
                  class="pi pi-envelope translate-y-0.5"
                  style="font-size: .8rem"
                ></i>
                <p>{{ client.email | emptyFallback }}</p>
              </div>
            </div>
          </td>

          <td>
            <p-button
              icon="pi pi-check"
              severity="secondary"
              rounded
              title="Seleccionar cliente"
              [ariaLabel]="'Seleccionar cliente ' + client.name"
              (onClick)="select(client)"
            />
          </td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td colspan="3" class="text-center py-8">
            <div class="flex flex-col items-center gap-3">
              <i class="pi pi-users text-4xl text-gray-400"></i>
              <p class="text-gray-600">No hay clientes disponibles</p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientSelectListComponent implements OnInit {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly clientService = inject(ClientsService);
  private readonly clientState = inject(ClientsState);

  readonly CLIENTS_PER_PAGE = 5;
  readonly clients = this.clientState.clients;

  ngOnInit(): void {
    this.clientService.loadAll();
  }

  select(client: Client): void {
    this.dialogRef?.close(client);
  }
}
