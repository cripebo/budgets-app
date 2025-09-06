import { computed, Injectable, Provider, signal } from '@angular/core';
import { BudgetItem } from './models/budgets.model';
import { CLEARABLE_STATE } from '@core/state/cleareable-state.token';

@Injectable({ providedIn: 'root' })
export class BudgetItemsState {
  private _itemsMap = signal<Map<number, BudgetItem[]>>(new Map());
  private _loading = signal<boolean>(false);

  readonly itemsMap = computed(() => this._itemsMap());
  readonly loading = computed(() => this._loading());

  itemsForBudget(budgetId: number) {
    return computed(() => this._itemsMap().get(budgetId) ?? []);
  }

  isLoaded(budgetId: number) {
    return this._itemsMap().has(budgetId);
  }

  setItems(budgetId: number, items: BudgetItem[]) {
    const newMap = new Map(this._itemsMap());
    newMap.set(budgetId, items);
    this._itemsMap.set(newMap);
    this._loading.set(false);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  clearItems(budgetId: number) {
    const newMap = new Map(this._itemsMap());
    newMap.delete(budgetId);
    this._itemsMap.set(newMap);
  }

  clear() {
    this._itemsMap.set(new Map());
    this._loading.set(false);
  }
}

export const provideBudgetItemsState: Provider[] = [
  { provide: CLEARABLE_STATE, useExisting: BudgetItemsState, multi: true },
];
