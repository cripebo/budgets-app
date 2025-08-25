import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-state-chip',
  imports: [],
  template: `
    <div
      class="inline py-1 px-2 rounded-md"
      [style]="{ background: colorBackground(), color: colorText() }"
    >
      {{ text().trim().length ? text() : DEFAULT_EMPTY_STRING }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateChipComponent {
  DEFAULT_EMPTY_STRING = 'ejemplo';
  text = input<string>(this.DEFAULT_EMPTY_STRING);
  colorBackground = input<string>('#000');
  colorText = input<string>('#FFF');
}
