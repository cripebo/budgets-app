import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-states-actions',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col gap-2">
      <p-button
        label="Crear estado"
        icon="pi pi-plus"
        class="mt-1.5"
        aria-label="Crear cliente"
        (onClick)="onCreate.emit()"
        styleClass="w-fit sm:w-50"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatesActionsComponent {
  onCreate = output();
}
