import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ItemsTableActionsComponent } from './components/items-table-actions/items-table-actions.component';
import { Item } from '@features/items/models/items.model';
import { ItemCategoryBadgeComponent } from '../item-category-badge/item-category-badge.component';

@Component({
  selector: 'app-items-table',
  imports: [
    TableModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    CurrencyPipe,
    ItemsTableActionsComponent,
    SkeletonModule,
    ItemCategoryBadgeComponent,
  ],
  template: `
    <p-table
      #itemsTable
      [value]="items()"
      stripedRows
      size="small"
      [globalFilterFields]="['name', 'category_name', 'price']"
      [loading]="loading()"
      [showLoader]="false"
      [paginator]="true"
      [rows]="itemsPerRow()"
      [rowsPerPageOptions]="itemsPerRowOptions()"
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
          <th>Categoria</th>
          <th>Precio</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>
            <app-item-category-badge [categoryName]="item.category_name" />
          </td>
          <td>{{ item.price | currency: 'EUR' : 'symbol' : '1.0-2' }}</td>
          <td>
            <app-items-table-actions
              (onEdit)="onEdit.emit(item.id)"
              (onDelete)="onDelete.emit(item.id)"
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
                <span>Cargando conceptos</span>
              </p>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsTableComponent {
  private readonly DEFAUL_ITEMS_PER_ROW = 10;
  private readonly DEFAUL_ROWS_PER_PAGE_OPTIONS = [10, 15, 20];

  items = input<Item[]>([]);
  loading = input(false);
  itemsPerRow = input(this.DEFAUL_ITEMS_PER_ROW);
  itemsPerRowOptions = input(this.DEFAUL_ROWS_PER_PAGE_OPTIONS);
  table = viewChild<Table>('itemsTable');

  onEdit = output<number>();
  onDelete = output<number>();

  onFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value, 'contains');
  }
}
