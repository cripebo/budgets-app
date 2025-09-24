import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Item } from '@features/items/models/items.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ItemsState } from '@features/items/states/items.state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-items-select',
  imports: [TableModule, CurrencyPipe, ButtonModule],
  template: `
    <p-table [value]="items()" [paginator]="true" [rows]="ITEMS_PER_PAGE">
      <ng-template #header>
        <tr>
          <th class="w-full">Nombre</th>
          <th>Precio</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>
            {{ item.name }}
          </td>
          <td>
            <div>
              <p>{{ item.price | currency: 'EUR' : 'symbol' : '1.0-2' }}</p>
            </div>
          </td>

          <td>
            <p-button
              icon="pi pi-check"
              severity="secondary"
              rounded
              (onClick)="select(item)"
            />
          </td>
        </tr>
      </ng-template>
      <ng-template #emptymessage>
        <tr>
          <td colspan="3" class="text-center py-8">
            <div class="flex flex-col items-center gap-3">
              <i class="pi pi-bookmark text-4xl text-gray-400"></i>
              <p class="text-gray-600">No hay conceptos disponibles</p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsSelectComponent {
  private dialogRef = inject(DynamicDialogRef);
  private itemState = inject(ItemsState);

  readonly ITEMS_PER_PAGE = 5;

  items = this.itemState.items;

  select(item: Item) {
    this.dialogRef.close(item);
  }
}
