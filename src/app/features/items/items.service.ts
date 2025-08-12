import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ItemsState } from './items.state';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { Item } from './models/items.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: ItemsState,
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
    if (this.state.hasItems()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: Item[]; success: boolean }>(`${this.urlBase}/items`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((items) => this.state.setItems(items)),
        catchError(this.handleError('loadAll - items')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  createItem(data: Partial<Item>) {
    const tempId = -Date.now();
    const tempItem = { id: tempId, ...data } as Item;
    this.state.addItem(tempItem);

    this.http
      .post<{ data: number; success: boolean }>(`${this.urlBase}/items`, data)
      .pipe(
        tap((response) => {
          const persistendItem = { id: response.data, ...data } as Item;
          this.state.replaceItem(tempId, persistendItem);
        }),
        catchError(
          this.handleError('createItem', () => {
            this.state.removeItem(tempId);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  updateItem(updatedItem: Item) {
    const originalItem = this.state.getById(updatedItem.id!);
    if (!originalItem) return;

    this.state.updateItem(updatedItem);

    this.http
      .patch<Item>(`${this.urlBase}/items/${updatedItem.id}`, updatedItem)
      .pipe(
        catchError(
          this.handleError('updatedItem', () => {
            this.state.updateItem(originalItem);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  deleteItem(id: number): void {
    const originalItem = this.state.getById(id);
    if (!originalItem) return;

    this.state.removeItem(id);

    this.http
      .delete(`${this.urlBase}/items/${id}`)
      .pipe(
        catchError(
          this.handleError('deleteItem', () => {
            this.state.addItem(originalItem);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.state.setLoading(true);
    this.http
      .get<Item[]>(`${this.urlBase}/items`)
      .pipe(
        tap((budgets) => this.state.setItems(budgets)),
        catchError(this.handleError('refresh - items')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }
}
