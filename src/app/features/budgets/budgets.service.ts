import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, take, catchError, of, map } from 'rxjs';
import { BudgetsState } from './budgets.state';
import { Budget } from './models/budgets.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: BudgetsState,
  ) {}

  private handleError(operation = 'operation') {
    return (error: any) => {
      console.error(`${operation} failed:`, error);
      return of(null);
    };
  }

  loadAll(): void {
    if (this.state.hasBudgets()) return;

    this.http
      .get<{ data: Budget[]; success: boolean }>(`${this.urlBase}/budgets`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((budgets) => this.state.setBudgets(budgets)),
        catchError(this.handleError('loadAll')),
        take(1),
      )
      .subscribe();
  }

  loadById(id: number): void {
    const existing = this.state.getById(id);
    if (existing) return;

    this.http
      .get<Budget>(`${this.urlBase}/budgets/${id}`)
      .pipe(
        tap((budget) => this.state.addOrUpdateBudget(budget)),
        catchError(this.handleError('loadById')),
        take(1),
      )
      .subscribe();
  }

  createBudget(data: Partial<Budget>): void {
    this.http
      .post<Budget>(`${this.urlBase}/budgets`, data)
      .pipe(
        tap((budget) => this.state.addBudget(budget)),
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
    this.http
      .delete(`${this.urlBase}/budgets/${id}`)
      .pipe(
        tap(() => this.state.removeBudget(id)),
        catchError(this.handleError('deleteBudget')),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.http
      .get<Budget[]>(`${this.urlBase}/budgets`)
      .pipe(
        tap((budgets) => this.state.setBudgets(budgets)),
        catchError(this.handleError('refresh')),
        take(1),
      )
      .subscribe();
  }
}
