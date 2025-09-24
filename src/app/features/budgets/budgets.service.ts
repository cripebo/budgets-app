import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, take, catchError, of, map, finalize } from 'rxjs';
import { BudgetsState } from './budgets.state';
import { Budget, BudgetWithPrice } from './models/budgets.model';
import { environment } from '@environments/environment';
import { State } from '@features/states/models/states.model';
import { ItemsState } from '@features/items/states/items.state';
import { BudgetItemsState } from './budget-items.state';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: BudgetsState,
    private budgetItemsState: BudgetItemsState,
  ) {}

  private handleError<T>(operation = 'operation', onErrorAction?: () => void) {
    return (error: any) => {
      console.error(`${operation} failed:`, error);
      if (onErrorAction) {
        onErrorAction();
      }
      return of<T | null>(null);
    };
  }

  loadAll(): void {
    if (this.state.hasBudgets()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: Budget[]; success: boolean }>(`${this.urlBase}/budgets`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((budgets) => this.state.setBudgets(budgets)),
        catchError(this.handleError('loadAll')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  loadDetailsById(budgetId: number) {
    if (this.budgetItemsState.isLoaded(budgetId)) return;

    this.http
      .get<{
        data: Budget;
        success: boolean;
      }>(`${this.urlBase}/budgets/${budgetId}`)
      .pipe(
        map((response) => response.data),
        tap((budget) =>
          this.budgetItemsState.setItems(budgetId, budget.items!),
        ),
        catchError(this.handleError('loadDetailsById')),
        take(1),
      )
      .subscribe();
  }

  createBudget(data: Partial<BudgetWithPrice>) {
    data.created_at = new Date().toISOString();

    return this.http
      .post<{ data: number; success: boolean }>(`${this.urlBase}/budgets`, data)
      .pipe(
        tap((response) => {
          if (!response.success) return;
          this.refresh();
        }),
        catchError(
          this.handleError<{ data: number; success: boolean }>('createBudget'),
        ),
        take(1),
      );
  }

  changeStatus(budgetId: number, newState: State) {
    const originalBudget = this.state.getById(budgetId);
    if (!originalBudget) return;

    const updatedBudget = structuredClone(originalBudget);
    updatedBudget.status = newState;
    this.state.updateBudget(updatedBudget);

    this.http
      .patch<{ data: number; success: boolean }>(
        `${this.urlBase}/budgets/${budgetId}`,
        { statusId: newState.id },
      )
      .pipe(
        tap(() => this.state.updateState(budgetId, newState)),
        catchError(
          this.handleError('changeStatus', () => {
            this.state.updateBudget(originalBudget);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  updateBudget(id: string, data: Partial<Budget>): void {
    this.http
      .put<Budget>(`${this.urlBase}/budgets/${id}`, data)
      .pipe(
        tap((updated) => this.state.updateBudget(updated)),
        catchError(this.handleError('updateBudget')),
        take(1),
      )
      .subscribe();
  }

  deleteBudget(id: number): void {
    const originalBudget = this.state.getById(id);
    if (!originalBudget) return;

    this.state.removeBudget(id);
    this.http
      .delete(`${this.urlBase}/budgets/${id}`)
      .pipe(
        catchError(
          this.handleError('deleteBudget', () => {
            this.state.addBudget(originalBudget);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.http
      .get<{ data: Budget[]; success: boolean }>(`${this.urlBase}/budgets`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((budgets) => this.state.setBudgets(budgets)),
        catchError(this.handleError('refresh')),
        take(1),
      )
      .subscribe();
  }
}
