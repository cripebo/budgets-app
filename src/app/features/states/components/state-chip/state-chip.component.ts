import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-state-chip',
  imports: [],
  template: `
    <div
      class="inline-block py-1 px-2 rounded-md text-center font-semibold"
      [style]="{ background: colorBackground(), color: colorText() }"
    >
      {{ text().trim().length ? text() : DEFAULT_EMPTY_STRING }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateChipComponent {
  private readonly DEFAULT_COLOR_BACKGROUND = '#000';
  private readonly DEFAULT_COLOR_TEXT = '#FFF';
  readonly DEFAULT_EMPTY_STRING = 'ejemplo';

  text = input<string>(this.DEFAULT_EMPTY_STRING);
  colorBackground = input<string>(this.DEFAULT_COLOR_BACKGROUND);
  colorText = input<string>(this.DEFAULT_COLOR_TEXT);
}
