import {
  Activity,
  ActivityAction,
  ActivityTargetType,
} from '@core/activity/models/activity.model';
import {
  ActivityLabelsParts,
  ActivityLabelStrategy,
} from '../activity-label.strategy';

export class BudgetActivityLabelStrategy implements ActivityLabelStrategy {
  supports(activity: Activity): boolean {
    return activity.target === ActivityTargetType.budgets;
  }

  getLabel(activity: Activity): ActivityLabelsParts {
    return this.generateLabel(activity.action, activity.name);
  }

  private generateLabel(action: ActivityAction, name: string) {
    const prefix =
      this.actionLabels[action] ?? 'Realizó una acción sobre el presupuesto';

    return {
      prefix,
    };
  }

  private readonly actionLabels: Record<string, string> = {
    insert: 'Se ha creado un nuevo presupuesto',
    update: 'Se ha actualizado el presupuesto',
    delete: 'Se eliminó el presupuesto',
  };
}
