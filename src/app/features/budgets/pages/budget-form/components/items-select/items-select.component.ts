import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { Item } from '@features/items/models/items.model';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ItemsState } from '@features/items/states/items.state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CurrencyPipe } from '@angular/common';
import { ItemCategoryBadgeComponent } from '@features/items/components/item-category-badge/item-category-badge.component';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-items-select',
  imports: [
    TableModule,
    CurrencyPipe,
    ButtonModule,
    ItemCategoryBadgeComponent,
    IconField,
    InputIcon,
    InputTextModule,
  ],
  template: `
    <p-table
      #itemsTable
      [value]="items()"
      [paginator]="true"
      [rows]="ITEMS_PER_PAGE"
      [globalFilterFields]="['name', 'price']"
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
              aria-label="Buscar en la tabla"
              (input)="onFilter($event)"
              placeholder="Buscar"
            />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th class="w-full" pSortableColumn="name">
            Nombre<p-sortIcon field="name" />
          </th>
          <th class="text-nowrap" pSortableColumn="category_id">
            Categoría<p-sortIcon field="category_id" />
          </th>
          <th class="text-nowrap" pSortableColumn="price">
            Precio<p-sortIcon field="price" />
          </th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>
            {{ item.name }}
          </td>
          <td><app-item-category-badge [categoryId]="item.category_id" /></td>
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
  styles: `
    :host ::ng-deep .p-sortable-column-icon {
      width: 0.7rem;
      transform: translateY(3px) translateX(3px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsSelectComponent {
  private dialogRef = inject(DynamicDialogRef);
  private itemState = inject(ItemsState);

  readonly ITEMS_PER_PAGE = 8;

  table = viewChild<Table>('itemsTable');
  items = this.itemState.items;

  select(item: Item) {
    this.dialogRef.close(item);
  }

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value.trim() || '', 'contains');
  }
}
