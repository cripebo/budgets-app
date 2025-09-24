import { Injectable, signal, computed, Provider } from '@angular/core';
import { Item, ItemCategory } from '../models/items.model';
import { CLEARABLE_STATE } from '@core/state/cleareable-state.token';

@Injectable({ providedIn: 'root' })
export class ItemCategoriesState {
  private _categories = signal<ItemCategory[]>([]);
  private _loading = signal<boolean>(false);

  readonly categories = computed(() => this._categories());
  readonly loading = computed(() => this._loading());

  hasCategories(): boolean {
    return this._categories().length > 0;
  }

  getById(id: number): ItemCategory | undefined {
    return this._categories().find((b) => b.id === id);
  }

  setCategories(categories: ItemCategory[]) {
    this._categories.set(categories);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addCategory(category: ItemCategory) {
    this._categories.update((prev) => [...prev, category]);
  }

  updateCategory(category: ItemCategory) {
    this._categories.update((prev) =>
      prev.map((c) => (c.id === category.id ? category : c)),
    );
  }

  replaceCategory(categoryId: number, category: ItemCategory) {
    this._categories.update((previousCategories) => {
      const index = previousCategories.findIndex((c) => c.id === categoryId);
      if (index === -1) return previousCategories;
      const updated = [...previousCategories];
      updated[index] = category;
      return updated;
    });
  }

  removeCategory(id: number) {
    this._categories.update((prev) => prev.filter((c) => c.id !== id));
  }

  addOrUpdateCategory(category: ItemCategory) {
    if (!category.id) {
      this.addCategory(category);
      return;
    }

    const exists = this.getById(category.id);
    if (exists) {
      this.updateCategory(category);
    } else {
      this.addCategory(category);
    }
  }

  clear() {
    this._categories.set([]);
    this._loading.set(false);
  }
}

export const provideItemCategoriesState: Provider[] = [
  { provide: CLEARABLE_STATE, useExisting: ItemCategoriesState, multi: true },
];
