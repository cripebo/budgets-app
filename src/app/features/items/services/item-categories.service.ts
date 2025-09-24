import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { Item, ItemCategory } from '../models/items.model';
import { ItemCategoriesState } from '../states/item-categories.state';

@Injectable({
  providedIn: 'root',
})
export class ItemCategoriesService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: ItemCategoriesState,
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
    if (this.state.hasCategories()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: ItemCategory[]; success: boolean }>(
        `${this.urlBase}/items/categories`,
      )
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((categories) => this.state.setCategories(categories)),
        catchError(this.handleError('loadAll - items')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  createCategory(data: Partial<ItemCategory>) {
    const tempId = -Date.now();
    const tempCategory = { id: tempId, ...data } as ItemCategory;
    this.state.addCategory(tempCategory);

    this.http
      .post<{ data: number; success: boolean }>(
        `${this.urlBase}/items/categories`,
        data,
      )
      .pipe(
        tap((response) => {
          const persistendCategory = {
            id: response.data,
            ...data,
          } as ItemCategory;
          this.state.replaceCategory(tempId, persistendCategory);
        }),
        catchError(
          this.handleError('createCategory', () => {
            this.state.removeCategory(tempId);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  updateItem(updatedCategory: ItemCategory) {
    const originalCategory = this.state.getById(updatedCategory.id!);
    if (!originalCategory) return;

    this.state.updateCategory(updatedCategory);

    this.http
      .patch<Item>(
        `${this.urlBase}/items/categories/${updatedCategory.id}`,
        updatedCategory,
      )
      .pipe(
        catchError(
          this.handleError('updatedCategory', () => {
            this.state.updateCategory(originalCategory);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  deleteItem(id: number): void {
    const originalCategory = this.state.getById(id);
    if (!originalCategory) return;

    this.state.removeCategory(id);

    this.http
      .delete(`${this.urlBase}/items/categories/${id}`)
      .pipe(
        catchError(
          this.handleError('deleteItem', () => {
            this.state.addCategory(originalCategory);
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
        tap((categories) => this.state.setCategories(categories)),
        catchError(this.handleError('refresh - items')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }
}
