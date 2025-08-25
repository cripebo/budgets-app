import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideBudgetsState } from '@features/budgets/budgets.state';
import { provideClientsState } from '@features/clients/clients.state';
import { provideItemsState } from '@features/items/items.state';
import { provideSettingsState } from '@features/settings/settings.state';
import { provideStatesState } from '@features/states/states.state';

export function provideAppStates(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideBudgetsState,
    provideClientsState,
    provideItemsState,
    provideSettingsState,
    provideStatesState,
  ]);
}
