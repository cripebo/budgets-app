import { inject, Injectable } from '@angular/core';
import { ActivityLabelFactory } from './activity-label-factory';
import { Activity } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityLabelService {
  private factory = inject(ActivityLabelFactory);

  getLabel(activity: Activity) {
    const strategy = this.factory.getStrategy(activity);
    return strategy?.getLabel(activity);
  }
}
