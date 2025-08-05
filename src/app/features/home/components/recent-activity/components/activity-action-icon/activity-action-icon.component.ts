import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityAction } from '@core/activity/models/activity.model';

interface ActionIconColors {
  icon: string;
  background: string;
}

@Component({
  selector: 'app-activity-action-icon',
  imports: [],
  template: ` <i
    [class]="getClasses()"
    class="rounded-full p-1.5"
    style="font-size: .8rem"
  ></i>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityActionIconComponent {
  protected readonly actionsIcons: Record<ActivityAction, string> = {
    insert: 'pi pi-plus',
    update: 'pi pi-pencil',
    delete: 'pi pi-times',
  };

  protected readonly actionsColor: Record<ActivityAction, ActionIconColors> = {
    insert: { icon: 'text-green-600', background: 'bg-green-400/40' },
    update: { icon: 'text-blue-500', background: 'bg-blue-400/40' },
    delete: { icon: 'text-red-500', background: 'bg-red-400/40' },
  };

  getClasses() {
    return `
    ${this.actionsIcons[this.action()]} 
    ${this.actionsColor[this.action()].icon} 
    ${this.actionsColor[this.action()].background}
    `;
  }

  action = input.required<ActivityAction>();
}
