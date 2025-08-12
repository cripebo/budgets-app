import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ItemsTableComponent } from '@features/items/components/items-table/items-table.component';
import { ItemsActionsComponent } from '@features/items/components/items-actions/items-actions.component';
import { ItemsService } from '@features/items/items.service';
import { ItemsState } from '@features/items/items.state';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ItemFormComponent } from '../item-form/item-form.component';
import { DeleteItemFormComponent } from '../delete-item-form/delete-item-form.component';
import { Item } from '@features/items/models/items.model';

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
export class ItemsComponent implements OnInit {
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

  private itemsService = inject(ItemsService);
  private itemsState = inject(ItemsState);
  protected items = this.itemsState.items;
  protected loading = this.itemsState.loading;

  ngOnInit(): void {
    this.itemsService.loadAll();
  }

  createItemModal() {
    const header = 'Crear concepto';

    this.dialogRef = this.dialogService.open(ItemFormComponent, {
      header,
      ...this.dialogConf,
    });

    this.dialogRef.onClose.subscribe((result: Item) => {
      if (!result) return;

      this.itemsService.createItem(result);
    });
  }

  editItemModal(itemId: number) {
    const header = 'Editar concepto';
    const item = this.itemsState.getById(itemId);

    this.dialogRef = this.dialogService.open(ItemFormComponent, {
      header,
      inputValues: { item },
      ...this.dialogConf,
    });

    this.dialogRef.onClose.subscribe((result: Item) => {
      if (!result) return;

      this.itemsService.updateItem(result);
    });
  }

  deleteItemModal(itemId: number) {
    const header = 'Eliminar concepto';
    const item = this.itemsState.getById(itemId);
    const customDialogConf = {
      width: '30vw',
      breakpoints: {
        '1024px': '60vw',
        '380px': '100%',
      },
    };

    this.dialogRef = this.dialogService.open(DeleteItemFormComponent, {
      header,
      inputValues: { item },
      ...this.dialogConf,
      ...customDialogConf,
    });

    this.dialogRef.onClose.subscribe((result: Item) => {
      if (!result) return;

      this.itemsService.deleteItem(result.id!);
    });
  }
}
