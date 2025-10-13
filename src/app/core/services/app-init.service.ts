import { Injectable } from '@angular/core';
import { BudgetsService } from '@features/budgets/budgets.service';
import { ClientsService } from '@features/clients/clients.service';
import { ItemsService } from '@features/items/services/items.service';
import { SettingsService } from '@features/settings/settings.service';
import { StatesService } from '@features/states/states.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(
    private budgets: BudgetsService,
    private clients: ClientsService,
    private items: ItemsService,
    private settings: SettingsService,
    private states: StatesService,
  ) {}

  loadAll(): void {
    this.budgets.loadAll();
    this.clients.loadAll();
    this.items.loadAll();
    this.settings.loadAll();
    this.states.loadAll();
  }
}
