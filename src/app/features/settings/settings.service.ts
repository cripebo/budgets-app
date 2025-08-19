import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SettingsState } from './settings.state';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { Settings } from './models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: SettingsState,
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
    this.state.setLoading(true);
    this.http
      .get<{ data: Settings; success: boolean }>(`${this.urlBase}/settings`)
      .pipe(
        map((response) => (response.success ? response.data : null)),
        tap((settings) => this.state.setSettings(settings!)),
        catchError(this.handleError('loadAll - settings')),
        take(1),
        finalize(() => this.state.setLoading(false)),
      )
      .subscribe();
  }

  saveSettings(updatedSettings: Settings) {
    const originalSettings = this.state.settings();
    if (!originalSettings) return;

    const { id, ...data } = updatedSettings;
    this.state.setSettings(updatedSettings);
    this.state.setSaving(true);

    this.http
      .post<Settings>(`${this.urlBase}/settings`, data)
      .pipe(
        catchError(
          this.handleError('updatedClient', () => {
            this.state.setSettings(originalSettings);
          }),
        ),
        take(1),
        finalize(() => this.state.setSaving(false)),
      )
      .subscribe();
  }
}
