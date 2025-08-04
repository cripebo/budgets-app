import { Activity } from '../models/activity.model';

export interface ActivityLabelsParts {
  prefix?: string;
  sufix?: string;
}

export interface ActivityLabelStrategy {
  supports(activity: Activity): boolean;
  getLabel(activity: Activity): ActivityLabelsParts;
}
