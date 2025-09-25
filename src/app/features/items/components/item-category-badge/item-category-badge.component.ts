import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ItemCategoriesState } from '@features/items/states/item-categories.state';

@Component({
  selector: 'app-item-category-badge',
  imports: [],
  template: `
    <div
      class="inline-block py-1 px-2 rounded-md text-center font-semibold text-nowrap bg-gray-200 text-gray-700"
    >
      {{ displayName()?.name ?? 'Sin categoría' }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCategoryBadgeComponent {
  itemsCategoryState = inject(ItemCategoriesState);
  categoryId = input.required<number | null>();
  displayName = computed(() =>
    this.itemsCategoryState.getById(this.categoryId() ?? -1),
  );
}
