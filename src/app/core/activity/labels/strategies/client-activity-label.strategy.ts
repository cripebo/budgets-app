import {
  Activity,
  ActivityTargetType,
} from '@core/activity/models/activity.model';
import {
  ActivityLabelsParts,
  ActivityLabelStrategy,
} from '../activity-label.strategy';

export class ClientActivityLabelStrategy implements ActivityLabelStrategy {
  supports(activity: Activity): boolean {
    return activity.target === ActivityTargetType.clients;
  }

  getLabel(activity: Activity): ActivityLabelsParts {
    const prefix =
      this.actionLabels[activity.action] ??
      'Realizó una acción sobre el cliente';

    return {
      prefix,
    };
  }

  private readonly actionLabels: Record<string, string> = {
    insert: 'Se ha creado un nuevo cliente',
    update: 'Se ha actualizado un cliente',
    delete: 'Se eliminó un cliente',
  };
}
