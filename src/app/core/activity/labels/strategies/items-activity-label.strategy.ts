import {
  Activity,
  ActivityTargetType,
} from '@core/activity/models/activity.model';
import {
  ActivityLabelsParts,
  ActivityLabelStrategy,
} from '../activity-label.strategy';

export class ItemsActivityLabelStrategy implements ActivityLabelStrategy {
  supports(activity: Activity): boolean {
    return activity.target === ActivityTargetType.items;
  }

  getLabel(activity: Activity): ActivityLabelsParts {
    const prefix =
      this.actionLabels[activity.action] ??
      'Realizó una acción sobre el concepto';

    return { prefix };
  }

  private readonly actionLabels: Record<string, string> = {
    insert: 'Se ha creado un nuevo concepto',
    update: 'Se ha actualizado un concepto',
    delete: 'Se eliminó un concepto',
  };
}
