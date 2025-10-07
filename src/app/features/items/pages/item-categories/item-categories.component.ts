import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoriesTableComponent } from '@features/items/components/categories-table/categories-table.component';
import { DeleteCategoryModalComponent } from '@features/items/components/categories-table/components/delete-category-modal/delete-category-modal.component';
import { ItemCategoryFormComponent } from '@features/items/components/item-category-form/item-category-form.component';
import { ItemCategory } from '@features/items/models/items.model';
import { ItemCategoriesService } from '@features/items/services/item-categories.service';
import { ItemCategoriesState } from '@features/items/states/item-categories.state';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-item-categories',
  imports: [CategoriesTableComponent, ItemCategoryFormComponent],
  providers: [DialogService],
  template: `
    <p class="text-sm mb-4">
      Define categorías para organizar y clasificar tus conceptos de forma más
      eficiente.
    </p>
    <section class="mb-4">
      <h3 class="text-md font-medium mb-2">Crear nueva categoría</h3>
      <app-item-category-form
        [existingCategories]="categories()"
        (onSubmit)="createCategory($event)"
      />
    </section>
    <section>
      <h3 class="text-md font-medium mb-2">Categorías existentes</h3>

      <app-categories-table
        [categories]="categories()"
        (onUpdate)="updateCategory($event)"
        (onDelete)="deleteCategory($event)"
      />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCategoriesComponent extends ModalHandler {
  private readonly itemCategoriesService = inject(ItemCategoriesService);
  private readonly itemCategoriesState = inject(ItemCategoriesState);
  categories = this.itemCategoriesState.categories;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  createCategory(categoryName: string) {
    const category = { name: categoryName };
    this.itemCategoriesService.createCategory(category);
  }

  updateCategory(data: { id: number; name: string }) {
    this.itemCategoriesService.updateCategory(data);
  }

  deleteCategory(categoryId: number) {
    const category = this.itemCategoriesState.getById(categoryId);

    this.openModal(DeleteCategoryModalComponent, {
      header: 'Eliminar categoría',
      inputValues: { category },
      width: '30vw',

      onClose: (result: ItemCategory) => {
        if (result) this.itemCategoriesService.deleteCategory(result.id!);
      },
    });
  }
}
