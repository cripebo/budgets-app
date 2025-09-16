import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { StatesState } from './states.state';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { State } from './models/states.model';
import { ToastService, ToastSeverity } from '@core/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: StatesState,
    private toastService: ToastService,
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
    if (this.state.hasStates()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: State[]; success: boolean }>(`${this.urlBase}/states`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((states) => this.state.setStates(states)),
        catchError(this.handleError('loadAll - states')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  createState(state: Partial<State>) {
    const tempId = -Date.now();
    const tempState = { id: tempId, ...state } as State;
    this.state.addState(tempState);

    this.http
      .post<{ data: number; success: boolean }>(`${this.urlBase}/states`, state)
      .pipe(
        tap((response) => {
          const persistendState = { id: response.data, ...state } as State;
          this.state.replaceState(tempId, persistendState);
        }),
        catchError(
          this.handleError('createState', () => {
            this.state.removeState(tempId);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  updateState(updatedState: State) {
    const originalState = this.state.getById(updatedState.id!);
    if (!originalState) return;

    const { id, ...data } = updatedState;
    this.state.updateState(updatedState);

    this.http
      .patch<State>(`${this.urlBase}/states/${id}`, data)
      .pipe(
        catchError(
          this.handleError('updatedState', () => {
            this.state.updateState(originalState);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  deleteState(id: number): void {
    const originalState = this.state.getById(id);
    if (!originalState) return;

    this.state.removeState(id);

    this.http
      .delete(`${this.urlBase}/states/${id}`)
      .pipe(
        catchError((err) =>
          this.handleError('deleteState', () => {
            this.state.addState(originalState);
            this.toastService.show(
              ToastSeverity.warn,
              'No se ha podido eliminar',
              err.error?.message ?? 'Error desconocido',
            );
          })(err),
        ),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.state.setLoading(true);
    this.http
      .get<State[]>(`${this.urlBase}/states`)
      .pipe(
        tap((states) => this.state.setStates(states)),
        catchError(this.handleError('refresh - states')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }
}
