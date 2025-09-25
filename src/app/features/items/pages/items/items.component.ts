import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ItemsTableComponent } from '@features/items/components/items-table/items-table.component';
import { ItemsActionsComponent } from '@features/items/components/items-actions/items-actions.component';
import { ItemsService } from '@features/items/services/items.service';
import { ItemsState } from '@features/items/states/items.state';
import { DialogService } from 'primeng/dynamicdialog';
import { ItemFormComponent } from '../item-form/item-form.component';
import { DeleteItemFormComponent } from '../delete-item-form/delete-item-form.component';
import { Item } from '@features/items/models/items.model';
import { ModalHandler } from '@shared/modals/modal-handler';
import { ItemCategoriesService } from '@features/items/services/item-categories.service';
import { ItemCategoriesState } from '@features/items/states/item-categories.state';

@Component({
  selector: 'app-items',
  imports: [ItemsTableComponent, ItemsActionsComponent],
  providers: [DialogService],
  template: `
    <div class="box-container">
      <div class="border-b border-surface flex flex-col gap-4 pb-4">
        <h1 class="text-xl font-bold">Conceptos</h1>
        <h3 class="text-sm sm:text-normal font-normal">
          Puede crear y editar los conceptos para tus presupuestosen esta página
        </h3>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row mt-4">
        <div>
          <app-items-actions (onCreate)="createItemModal()" />
        </div>
        <div class="flex-1">
          <app-items-table
            [items]="items()"
            [loading]="loading()"
            (onEdit)="editItemModal($event)"
            (onDelete)="deleteItemModal($event)"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent extends ModalHandler implements OnInit {
  private itemsService = inject(ItemsService);
  private itemCategoriesService = inject(ItemCategoriesService);
  private itemsState = inject(ItemsState);
  private itemCategoriesState = inject(ItemCategoriesState);
  protected items = this.itemsState.items;
  protected categories = this.itemCategoriesState.categories;
  protected loading = this.itemsState.loading;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.itemsService.loadAll();
    this.itemCategoriesService.loadAll();
  }

  createItemModal() {
    this.openModal(ItemFormComponent, {
      header: 'Crear concepto',
      inputValues: { categories: this.categories() },
      onClose: (result: Item) => {
        if (result) this.itemsService.createItem(result);
      },
    });
  }

  editItemModal(itemId: number) {
    const item = this.itemsState.getById(itemId);

    this.openModal(ItemFormComponent, {
      header: 'Editar concepto',
      inputValues: { item, categories: this.categories() },
      onClose: (result: Item) => {
        if (result) this.itemsService.updateItem(result);
      },
    });
  }

  deleteItemModal(itemId: number) {
    const item = this.itemsState.getById(itemId);

    this.openModal(DeleteItemFormComponent, {
      header: 'Eliminar concepto',
      inputValues: { item },
      width: '30vw',

      onClose: (result: Item) => {
        if (result) this.itemsService.deleteItem(result.id!);
      },
    });
  }
}
