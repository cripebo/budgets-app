import { Injectable, signal, computed, Provider } from '@angular/core';
import { Budget } from './models/budgets.model';
import { CLEARABLE_STATE } from '@core/state/cleareable-state.token';
import { State } from '@features/states/models/states.model';

@Injectable({ providedIn: 'root' })
export class BudgetsState {
  private _budgets = signal<Budget[]>([]);
  private _loading = signal<boolean>(false);

  readonly budgets = computed(() => this._budgets());
  readonly loading = computed(() => this._loading());

  hasBudgets(): boolean {
    return this._budgets().length > 0;
  }

  getById(id: number): Budget | undefined {
    return this._budgets().find((b) => b.id === id);
  }

  setBudgets(budgets: Budget[]) {
    this._budgets.set(budgets);
    this._loading.set(false);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addBudget(budget: Budget) {
    this._budgets.update((prev) => [...prev, budget]);
  }

  updateBudget(budget: Budget) {
    this._budgets.update((prev) =>
      prev.map((b) => (b.id === budget.id ? budget : b)),
    );
  }

  updateState(budgetId: number, newState: State) {
    this._budgets.update((prev) =>
      prev.map((b) => {
        if (b.id !== budgetId) return b;

        b.status = newState;
        return b;
      }),
    );
  }

  removeBudget(id: number) {
    this._budgets.update((prev) => prev.filter((b) => b.id !== id));
  }

  addOrUpdateBudget(budget: Budget) {
    const exists = this.getById(budget.id);
    if (exists) {
      this.updateBudget(budget);
    } else {
      this.addBudget(budget);
    }
  }

  clear() {
    this._budgets.set([]);
    this._loading.set(false);
  }
}

export const provideBudgetsState: Provider[] = [
  { provide: CLEARABLE_STATE, useExisting: BudgetsState, multi: true },
];
