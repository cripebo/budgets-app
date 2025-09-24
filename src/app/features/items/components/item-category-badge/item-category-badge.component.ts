import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-item-category-badge',
  imports: [],
  template: `
    <div
      class="inline-block py-1 px-2 rounded-md text-center font-semibold text-nowrap bg-gray-200 text-gray-700"
    >
      {{ categoryName() ?? 'Sin categoría' }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCategoryBadgeComponent {
  categoryName = input.required<string | null>();
}
