import { Injectable } from '@angular/core';
import { ActivityLabelStrategy } from './activity-label.strategy';
import { BudgetActivityLabelStrategy } from './strategies/budget-activity-label.strategy';
import { Activity } from '../models/activity.model';
import { ItemsActivityLabelStrategy } from './strategies/items-activity-label.strategy';
import { ClientActivityLabelStrategy } from './strategies/client-activity-label.strategy';
import { StateActivityLabelStrategy } from './strategies/states-activity-label.strategy';

@Injectable({ providedIn: 'root' })
export class ActivityLabelFactory {
  private strategies: ActivityLabelStrategy[] = [
    new BudgetActivityLabelStrategy(),
    new ItemsActivityLabelStrategy(),
    new ClientActivityLabelStrategy(),
    new StateActivityLabelStrategy(),
  ];

  getStrategy(activity: Activity) {
    return this.strategies.find((s) => s.supports(activity));
  }
}
