import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ItemCategory } from '@features/items/models/items.model';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CategoriesTableActionsComponent } from './components/categories-table-actions/categories-table-actions.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-table',
  imports: [
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CategoriesTableActionsComponent,
    FormsModule,
  ],
  template: `
    <p-table
      #table
      [value]="categories()"
      stripedRows
      size="small"
      [globalFilterFields]="['name']"
      [paginator]="true"
      [rows]="rows()"
      editMode="row"
      dataKey="id"
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
              (input)="applyGlobalFilter($event)"
              placeholder="Buscar"
            />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template #header>
        <tr>
          <th class="w-full">Nombre</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-category let-editing="editing" let-ri="rowIndex">
        <tr [pEditableRow]="category">
          <td>
            @if (isEditing(category.id)) {
              <input
                class="w-full"
                pInputText
                type="text"
                [(ngModel)]="editingValues[category.id]"
              />
            } @else {
              {{ category.name }}
            }
          </td>
          <td>
            <app-categories-table-actions
              [editing]="isEditing(category.id)"
              (onEdit)="startEdit(category)"
              (onDelete)="onDelete.emit(category.id)"
              (onConfirmEdit)="confirmEdit(category.id)"
              (onCancelEdit)="cancelEdit(category.id)"
              [disableConfirm]="!isValidName(editingValues[category.id])"
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
export class CategoriesTableComponent {
  private readonly DEFAULT_TABLE_ROWS = 8;

  readonly table = viewChild<Table>('table');

  readonly categories = input<ItemCategory[]>([]);
  readonly rows = input(this.DEFAULT_TABLE_ROWS);

  onUpdate = output<{ id: number; name: string }>();
  onDelete = output<number>();

  private editingIds = new Set<number>();
  editingValues: Record<number, string> = {};

  isEditing(id: number): boolean {
    return this.editingIds.has(id);
  }

  startEdit(category: ItemCategory): void {
    if (!category.id) return;

    this.editingIds.add(category.id);
    this.editingValues[category.id] = category.name;
  }

  confirmEdit(id: number): void {
    const newName = this.editingValues[id]?.trim();

    if (!newName) {
      console.warn('Some error with new name for category while editing');
      return;
    }

    this.onUpdate.emit({ id, name: newName });
    this.cancelEdit(id);
  }

  cancelEdit(id: number): void {
    this.editingIds.delete(id);
    delete this.editingValues[id];
  }

  applyGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.table()?.filterGlobal(value, 'contains');
  }

  isValidName(value?: string): boolean {
    return !!value?.trim();
  }
}
