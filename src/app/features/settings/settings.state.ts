import { computed, Injectable, signal } from '@angular/core';
import { Settings } from './models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsState {
  private _settings = signal<Settings | null>(null);
  private _loading = signal<boolean>(false);
  private _saving = signal<boolean>(false);

  readonly settings = computed(() => this._settings());
  readonly loading = computed(() => this._loading());
  readonly saving = computed(() => this._saving());

  setSettings(settings: Settings) {
    this._settings.set(settings);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  setSaving(value: boolean) {
    this._saving.set(value);
  }

  clear() {
    this._settings.set(null);
    this._loading.set(false);
    this._saving.set(false);
  }
}
