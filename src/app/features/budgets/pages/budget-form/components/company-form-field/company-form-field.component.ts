import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '@features/settings/settings.service';
import { SettingsState } from '@features/settings/settings.state';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-company-form-field',
  imports: [ReactiveFormsModule, InputTextModule],
  template: `
    <section [formGroup]="parentFormGroup()">
      <div formGroupName="company" class="flex flex-col gap-2 pb-8">
        <h3 for="client-name" class="font-semibold text-xl">
          Datos sobre tu empresa
        </h3>

        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-2">
            <label for="company-name" class="text-black/60 font-semibold"
              >Nombre*</label
            >
            <input
              pInputText
              id="company-name"
              aria-describedby="company-name-help"
              formControlName="company-name"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label for="company-email" class="text-black/60 font-semibold"
                >Correo electrónico</label
              >
              <input
                pInputText
                id="company-email"
                aria-describedby="company-email-help"
                formControlName="company-email"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="company-phone" class="text-black/60 font-semibold"
                >Teléfono</label
              >
              <input
                pInputText
                id="company-phone"
                aria-describedby="company-phone-help"
                formControlName="company-phone"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="company-nif" class="text-black/60 font-semibold"
                >NIF</label
              >
              <input
                pInputText
                id="company-nif"
                aria-describedby="company-nif-help"
                formControlName="company-nif"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="company-address" class="text-black/60 font-semibold"
                >Dirección</label
              >
              <input
                pInputText
                id="company-address"
                aria-describedby="company-address-help"
                formControlName="company-address"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyFormFieldComponent implements OnInit {
  settingsService = inject(SettingsService);
  settingsState = inject(SettingsState);
  parentFormGroup = input.required<FormGroup>();

  settings = this.settingsState.settings;

  constructor() {
    effect(() => {
      this.parentFormGroup().patchValue({
        company: {
          'company-name': this.settings()?.company_name,
          'company-email': this.settings()?.email,
          'company-phone': this.settings()?.phone,
          'company-nif': this.settings()?.nif,
          'company-address': this.settings()?.address,
        },
      });
    });
  }

  ngOnInit(): void {
    this.settingsService.loadAll();
  }
}
