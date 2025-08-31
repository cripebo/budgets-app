import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingsState } from '@features/settings/settings.state';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-conditions-form-fields',
  imports: [InputTextModule, CheckboxModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-8 pb-8" [formGroup]="parentFormGroup()">
      <label for="client-name" class="font-semibold text-md">Condiciones</label>
      <input
        pInputText
        id="client-name"
        aria-describedby="client-name-help"
        formControlName="conditions"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionsFormFieldsComponent {
  parentFormGroup = input.required<FormGroup>();
  settingsState = inject(SettingsState);
  settings = this.settingsState.settings;

  constructor() {
    effect(() => {
      this.parentFormGroup().patchValue({
        conditions: this.settings()?.conditions,
      });
    });
  }
}
