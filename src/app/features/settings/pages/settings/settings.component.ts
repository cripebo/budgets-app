import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsState } from '@features/settings/settings.state';
import { SettingsFormComponent } from '@features/settings/components/settings-form/settings-form.component';
import { Settings } from '@features/settings/models/settings.model';
import { SettingsService } from '@features/settings/settings.service';

@Component({
  selector: 'app-settings',
  imports: [SettingsFormComponent],
  template: `
    <div class="box-container">
      <div class="border-b border-surface flex flex-col gap-4 pb-4">
        <h1 class="text-xl font-bold">Configuración</h1>
        <h3 class="text-sm sm:text-normal font-normal">
          Esta es la configuración general de la aplicación. Introduce aquí los
          datos de tu empresa. Se usarán de forma predeterminada en los
          presupuestos, aunque podrás modificarlos en cada documento.
        </h3>
      </div>
      <div class="flex flex-col gap-4 mt-4">
        <app-settings-form
          [settings]="settings()"
          [loading]="loading()"
          [saving]="saving()"
          (onSave)="save($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);
  private settingsState = inject(SettingsState);
  readonly settings = this.settingsState.settings;
  readonly loading = this.settingsState.loading;
  readonly saving = this.settingsState.saving;

  save(settings: Settings) {
    this.settingsService.saveSettings(settings);
  }
}
