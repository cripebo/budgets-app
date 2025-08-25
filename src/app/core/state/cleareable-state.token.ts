import { InjectionToken } from '@angular/core';
import { ClearableState } from './clearable-state.model';

export const CLEARABLE_STATE = new InjectionToken<ClearableState[]>(
  'CLEARABLE_STATE',
);
