import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, take, catchError, of, map, finalize } from 'rxjs';
import { environment } from '@environments/environment';
import { State } from '@features/states/models/states.model';
import { BudgetTemplatesState } from '../states/budget-templates.state';
import { BudgetTemplate } from '../models/budgets.model';

@Injectable({ providedIn: 'root' })
export class BudgetTemplatesService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: BudgetTemplatesState,
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
    if (this.state.hasTemplates()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: BudgetTemplate[]; success: boolean }>(
        `${this.urlBase}/templates`,
      )
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((templates) => this.state.setTemplates(templates)),
        catchError(this.handleError('loadAll')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  createTemplate(data: Partial<BudgetTemplate>) {
    return this.http
      .post<{
        data: number;
        success: boolean;
      }>(`${this.urlBase}/templates`, data)
      .pipe(
        tap((response) => {
          if (!response.success) return;
          this.refresh();
        }),
        catchError(
          this.handleError<{ data: number; success: boolean }>(
            'createTemplate',
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  updateTemplate(id: string, data: Partial<BudgetTemplate>): void {
    this.http
      .put<BudgetTemplate>(`${this.urlBase}/templates/${id}`, data)
      .pipe(
        tap((updated) => this.state.updateTemplate(updated)),
        catchError(this.handleError('updateTemplate')),
        take(1),
      )
      .subscribe();
  }

  deleteTemplate(id: number): void {
    const originalTemplate = this.state.getById(id);
    if (!originalTemplate) return;

    this.state.removeTemplate(id);
    this.http
      .delete(`${this.urlBase}/templates/${id}`)
      .pipe(
        catchError(
          this.handleError('deleteBudget', () => {
            this.state.addTemplate(originalTemplate);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.http
      .get<{ data: BudgetTemplate[]; success: boolean }>(
        `${this.urlBase}/templates`,
      )
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((templates) => this.state.setTemplates(templates)),
        catchError(this.handleError('refresh')),
        take(1),
      )
      .subscribe();
  }
}
