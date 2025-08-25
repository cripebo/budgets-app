import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { State } from '@features/states/models/states.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { StateChipComponent } from '../state-chip/state-chip.component';
import { StatesTableActionsComponent } from './components/states-table-actions/states-table-actions.component';

@Component({
  selector: 'app-states-table',
  imports: [
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    SkeletonModule,
    StateChipComponent,
    StatesTableActionsComponent,
  ],
  template: `
    <p-table
      #statesTable
      [value]="states()"
      stripedRows
      size="small"
      [globalFilterFields]="['name']"
      [loading]="loading()"
      [showLoader]="false"
      [paginator]="true"
      [rows]="5"
    >
      <ng-template #caption>
        <div class="flex -mx-2">
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
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th>Nombre</th>
          <th>Color</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-state>
        <tr>
          <td>{{ state.name }}</td>
          <td>
            <app-state-chip
              [colorBackground]="state.colorBackground"
              [colorText]="state.colorText"
            />
          </td>
          <td>
            <app-states-table-actions
              [canRemove]="state.removable"
              (onEdit)="onEdit.emit(state.id)"
              (onDelete)="onDelete.emit(state.id)"
            />
          </td>
        </tr>
      </ng-template>

      <ng-template #loadingbody>
        <tr>
          <td [colSpan]="3">
            <div class="h-14 grid items-center justify-center">
              <p class="flex flex-row items-center gap-2">
                <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
                <span>Cargando estados</span>
              </p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatesTableComponent {
  states = input<State[]>([]);
  loading = input<boolean>(false);
  table = viewChild<Table>('statesTable');

  onEdit = output<number>();
  onDelete = output<number>();

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value, 'contains');
  }
}
