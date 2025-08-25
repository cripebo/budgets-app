import { Inject, Injectable } from '@angular/core';
import { CLEARABLE_STATE } from './cleareable-state.token';
import { ClearableState } from './clearable-state.model';

@Injectable({ providedIn: 'root' })
export class AppStateManager {
  constructor(
    @Inject(CLEARABLE_STATE) private readonly clearables: ClearableState[],
  ) {}

  clearAll(): void {
    for (const state of this.clearables) {
      state.clear();
    }
  }
}
