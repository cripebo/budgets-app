import { EmptyFallbackPipe } from './../../../../shared/pipes/empty-fallback.pipe';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Client } from '@features/clients/models/clients.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ClientsTableActionsComponent } from './components/clients-table-actions/clients-table-actions.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clients-table',
  imports: [
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ClientsTableActionsComponent,
    EmptyFallbackPipe,
    ButtonModule,
  ],
  template: `
    <p-table
      #clientsTable
      [value]="clients()"
      stripedRows
      size="small"
      [globalFilterFields]="['name', 'price']"
      [loading]="loading()"
      [showLoader]="false"
      [paginator]="true"
      [rows]="5"
    >
      <ng-template #caption>
        <div class="flex -mx-2 justify-between items-center">
          <p-iconfield iconPosition="left" class="w-full sm:w-[300px]">
            <p-inputicon>
              <i class="pi pi-search"></i>
            </p-inputicon>
            <input
              class="w-full"
              pInputText
              pSize="small"
              type="text"
              (input)="onFilter($event)"
              placeholder="Buscar"
            />
          </p-iconfield>
          <div class="flex justify-center">
            <p-button
              (click)="onExport.emit()"
              rounded="true"
              title="Exportar CSV"
              ariaLabel="Exportar CSV"
              severity="secondary"
              icon="pi pi-file-export"
              [loading]="exporting()"
            />
          </div>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-client>
        <tr>
          <td>{{ client.name }}</td>
          <td>{{ client.address | emptyFallback }}</td>
          <td>{{ client.email | emptyFallback }}</td>
          <td>{{ client.phone | emptyFallback }}</td>
          <td>
            <app-clients-table-actions
              (onEdit)="onEdit.emit(client.id)"
              (onDelete)="onDelete.emit(client.id)"
            />
          </td>
        </tr>
      </ng-template>

      <ng-template #loadingbody>
        <tr>
          <td [colSpan]="5">
            <div class="h-14 grid items-center justify-center">
              <p class="flex flex-row items-center gap-2">
                <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
                <span>Cargando clientes</span>
              </p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsTableComponent {
  clients = input.required<Client[]>();
  loading = input<boolean>(false);
  exporting = input<boolean>(false);
  table = viewChild<Table>('clientsTable');

  onEdit = output<number>();
  onDelete = output<number>();
  onExport = output();

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value, 'contains');
  }
}
