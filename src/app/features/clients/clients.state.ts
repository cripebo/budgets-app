import { computed, Injectable, signal } from '@angular/core';
import { Client } from './models/clients.model';

@Injectable({ providedIn: 'root' })
export class ClientsState {
  private _clients = signal<Client[]>([]);
  private _loading = signal<boolean>(false);

  readonly clients = computed(() => this._clients());
  readonly loading = computed(() => this._loading());

  hasClient(): boolean {
    return this._clients().length > 0;
  }

  getById(id: number): Client | undefined {
    return this._clients().find((c) => c.id === id);
  }

  setClients(clients: Client[]) {
    this._clients.set(clients);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addClient(client: Client) {
    this._clients.update((prev) => [...prev, client]);
  }

  updateClient(client: Client) {
    this._clients.update((prev) =>
      prev.map((c) => (c.id === client.id ? client : c)),
    );
  }

  replaceClient(clientId: number, client: Client) {
    this._clients.update((previousClients) => {
      const index = previousClients.findIndex((c) => c.id === clientId);
      if (index === -1) return previousClients;
      const updated = [...previousClients];
      updated[index] = client;
      return updated;
    });
  }

  removeClient(id: number) {
    this._clients.update((prev) => prev.filter((c) => c.id !== id));
  }

  clear() {
    this._clients.set([]);
    this._loading.set(false);
  }
}
