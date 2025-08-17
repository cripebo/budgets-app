import { Injectable } from '@angular/core';
import { ClientsState } from './clients.state';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { Client } from './models/clients.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: ClientsState,
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
    if (this.state.hasClient()) return;

    this.state.setLoading(true);
    this.http
      .get<{ data: Client[]; success: boolean }>(`${this.urlBase}/clients`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((clients) => this.state.setClients(clients)),
        catchError(this.handleError('loadAll - clients')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  createClient(client: Client) {
    const tempId = -Date.now();
    const tempClient = { id: tempId, ...client } as Client;
    this.state.addClient(tempClient);

    this.http
      .post<{ data: number; success: boolean }>(
        `${this.urlBase}/clients`,
        client,
      )
      .pipe(
        tap((response) => {
          const persistendClient = { id: response.data, ...client } as Client;
          this.state.replaceClient(tempId, persistendClient);
        }),
        catchError(
          this.handleError('createClient', () => {
            this.state.removeClient(tempId);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  updateClient(updatedClient: Client) {
    const originalClient = this.state.getById(updatedClient.id!);
    if (!originalClient) return;

    const { id, ...data } = updatedClient;
    this.state.updateClient(updatedClient);

    this.http
      .patch<Client>(`${this.urlBase}/clients/details/${id}`, data)
      .pipe(
        catchError(
          this.handleError('updatedClient', () => {
            this.state.updateClient(originalClient);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  deleteClient(id: number): void {
    const originalClient = this.state.getById(id);
    if (!originalClient) return;

    this.state.removeClient(id);

    this.http
      .delete(`${this.urlBase}/clients/details/${id}`)
      .pipe(
        catchError(
          this.handleError('deleteClient', () => {
            this.state.addClient(originalClient);
          }),
        ),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.state.setLoading(true);
    this.http
      .get<Client[]>(`${this.urlBase}/clients`)
      .pipe(
        tap((clients) => this.state.setClients(clients)),
        catchError(this.handleError('refresh - clients')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }
}
