import { computed, Injectable, signal } from '@angular/core';
import { Activity } from './models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityState {
  private _activity = signal<Activity[]>([]);
  private _loaded = signal<boolean>(false);

  readonly activity = computed(() => this._activity());
  readonly loaded = computed(() => this._loaded());

  readonly hasActivity = computed(() => this.activity().length > 0);

  setActivity(activities: Activity[]) {
    this._activity.set(activities);
    this._loaded.set(true);
  }

  setLoaded(value: boolean) {
    this._loaded.set(value);
  }

  addActivity(activity: Activity) {
    this._activity.update((prev) => [...prev, activity]);
  }

  updateActivity(activity: Activity) {
    this._activity.update((prev) =>
      prev.map((a) => (a.id === activity.id ? activity : a)),
    );
  }

  removeActivity(id: number) {
    this._activity.update((prev) => prev.filter((a) => a.id !== id));
  }

  clear() {
    this._activity.set([]);
    this._loaded.set(false);
  }
}
