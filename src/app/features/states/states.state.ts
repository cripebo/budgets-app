import { Injectable, signal, computed } from '@angular/core';
import { State } from './models/states.model';

@Injectable({ providedIn: 'root' })
export class StatesState {
  private _states = signal<State[]>([]);
  private _loading = signal<boolean>(false);

  readonly states = computed(() => this._states());
  readonly loading = computed(() => this._loading());

  hasStates(): boolean {
    return this._states().length > 0;
  }

  getById(id: number): State | undefined {
    return this._states().find((b) => b.id === id);
  }

  setStates(states: State[]) {
    this._states.set(states);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addState(state: State) {
    this._states.update((prev) => [...prev, state]);
  }

  updateState(state: State) {
    this._states.update((prev) =>
      prev.map((s) => (s.id === state.id ? state : s)),
    );
  }

  replaceState(stateId: number, state: State) {
    this._states.update((previousStates) => {
      const index = previousStates.findIndex((s) => s.id === stateId);
      if (index === -1) return previousStates;
      const updated = [...previousStates];
      updated[index] = state;
      return updated;
    });
  }

  removeState(id: number) {
    this._states.update((prev) => prev.filter((s) => s.id !== id));
  }

  addOrUpdateState(state: State) {
    if (!state.id) {
      this.addState(state);
      return;
    }

    const exists = this.getById(state.id);
    if (exists) {
      this.updateState(state);
    } else {
      this.addState(state);
    }
  }

  clear() {
    this._states.set([]);
    this._loading.set(false);
  }
}
