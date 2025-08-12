import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-items-actions',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-col gap-4">
      <p-button
        label="Crear concepto"
        icon="pi pi-plus"
        class="mt-1.5"
        aria-label="Crear concepto"
        (onClick)="onCreate.emit()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsActionsComponent {
  onCreate = output();
}
