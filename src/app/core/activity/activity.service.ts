import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityState } from './activity.state';
import { environment } from '@environments/environment';
import { catchError, finalize, map, of, take, tap } from 'rxjs';
import { Activity } from './models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private urlBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private state: ActivityState,
  ) {}

  private handleError(operation = 'operation') {
    return (error: any) => {
      console.error(`${operation} failed:`, error);
      this.state.setLoaded(true);
      return of(null);
    };
  }

  loadAll(): void {
    if (this.state.hasActivity()) return;

    this.http
      .get<{ data: Activity[]; success: boolean }>(`${this.urlBase}/activity`)
      .pipe(
        map((response) => (response.success ? response.data : [])),
        tap((activity) => this.state.setActivity(activity)),
        catchError(this.handleError('loadAll')),
        take(1),
      )
      .subscribe();
  }

  refresh(): void {
    this.http
      .get<Activity[]>(`${this.urlBase}/activity`)
      .pipe(
        tap((activity) => this.state.setActivity(activity)),
        catchError(this.handleError('refresh')),
        take(1),
      )
      .subscribe();
  }
}
