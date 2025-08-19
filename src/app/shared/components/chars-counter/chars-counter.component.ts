import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type CharactersCounterPosition = 'left' | 'right';

@Component({
  selector: 'app-chars-counter',
  imports: [NgClass],
  template: `
    <div
      class="flex flex-row"
      [class.justify-start]="position() === 'left'"
      [class.justify-end]="position() === 'right'"
    >
      <p
        class="font-normal text-xs"
        [ngClass]="{
          'font-semibold text-indigo-600': currentChars() === maxChars(),
        }"
      >
        <span id="current-chars">{{ currentChars() }}</span> /
        <span id="max-chars">{{ maxChars() }}</span>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharsCounterComponent {
  currentChars = input<number>(0);
  maxChars = input<number>(300);
  position = input<CharactersCounterPosition>('left');
}
