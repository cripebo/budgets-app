import { Injectable, signal, computed, Provider } from '@angular/core';
import { Item } from './models/items.model';
import { CLEARABLE_STATE } from '@core/state/cleareable-state.token';

@Injectable({ providedIn: 'root' })
export class ItemsState {
  private _items = signal<Item[]>([]);
  private _loading = signal<boolean>(false);

  readonly items = computed(() => this._items());
  readonly loading = computed(() => this._loading());

  hasItems(): boolean {
    return this._items().length > 0;
  }

  getById(id: number): Item | undefined {
    return this._items().find((b) => b.id === id);
  }

  setItems(items: Item[]) {
    this._items.set(items);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addItem(item: Item) {
    this._items.update((prev) => [...prev, item]);
  }

  updateItem(item: Item) {
    this._items.update((prev) =>
      prev.map((i) => (i.id === item.id ? item : i)),
    );
  }

  replaceItem(itemId: number, item: Item) {
    this._items.update((previousItems) => {
      const index = previousItems.findIndex((i) => i.id === itemId);
      if (index === -1) return previousItems;
      const updated = [...previousItems];
      updated[index] = item;
      return updated;
    });
  }

  removeItem(id: number) {
    this._items.update((prev) => prev.filter((i) => i.id !== id));
  }

  addOrUpdateBudget(item: Item) {
    if (!item.id) {
      this.addItem(item);
      return;
    }

    const exists = this.getById(item.id);
    if (exists) {
      this.updateItem(item);
    } else {
      this.addItem(item);
    }
  }

  clear() {
    this._items.set([]);
    this._loading.set(false);
  }
}

export const provideItemsState: Provider[] = [
  { provide: CLEARABLE_STATE, useExisting: ItemsState, multi: true },
];
