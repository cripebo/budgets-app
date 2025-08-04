import {
  Activity,
  ActivityTargetType,
} from '@core/activity/models/activity.model';
import {
  ActivityLabelsParts,
  ActivityLabelStrategy,
} from '../activity-label.strategy';

export class StateActivityLabelStrategy implements ActivityLabelStrategy {
  supports(activity: Activity): boolean {
    return activity.target === ActivityTargetType.states;
  }

  getLabel(activity: Activity): ActivityLabelsParts {
    const prefix =
      this.actionLabels[activity.action] ??
      'Realizó una acción sobre el estado';

    return {
      prefix,
    };
  }

  private readonly actionLabels: Record<string, string> = {
    insert: 'Se ha creado un nuevo estado',
    update: 'Se ha actualizado un estado',
    delete: 'Se eliminó un estado',
  };
}
