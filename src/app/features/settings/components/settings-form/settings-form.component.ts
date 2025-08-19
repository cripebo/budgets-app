import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Settings } from '@features/settings/models/settings.model';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { CharsCounterComponent } from '@shared/components/chars-counter/chars-counter.component';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-settings-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    TextareaModule,
    CharsCounterComponent,
    MessageModule,
  ],
  template: `
    <form [formGroup]="settingsForm" class="flex flex-col gap-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-semibold" for="company_name"
            >Nombre de la empresa*</label
          >
          <input
            pInputText
            id="company_name"
            aria-describedby="company_name-help"
            formControlName="company_name"
          />
        </div>
        <div class="flex flex-col gap-2 md:col-span-2">
          <label class="font-semibold" for="address">Dirección</label>
          <input
            pInputText
            id="address"
            aria-describedby="address-help"
            formControlName="address"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-semibold" for="nif">NIF</label>
          <input
            pInputText
            id="nif"
            aria-describedby="nif-help"
            formControlName="nif"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-semibold" for="email">Correo electrónico</label>
          <input
            pInputText
            id="email"
            aria-describedby="email-help"
            formControlName="email"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-semibold" for="phone">Teléfono</label>
          <input
            pInputText
            id="phone"
            aria-describedby="phone-help"
            formControlName="phone"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-semibold" for="iva"
            >IVA
            <i
              class="pi pi-info-circle"
              style="font-size: .8rem"
              pTooltip="Este es el IVA por defecto que se aplicará en los presupuestos, pero este campo puede modificarse."
              tooltipPosition="right"
            ></i
          ></label>
          <p-inputnumber
            formControlName="iva"
            inputId="iva"
            ariaDescribedBy="iva-help"
            suffix=" %"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-2 md:col-span-2">
          <label class="font-semibold" for="conditions">Condiciones</label>
          <textarea
            #conditions
            id="conditions"
            aria-describedby="conditions-help"
            rows="1"
            cols="30"
            formControlName="conditions"
            pTextarea
            [maxLength]="CONDITIONS_MAX_LENGTH"
            [autoResize]="true"
          ></textarea>
          <app-chars-counter
            [currentChars]="conditions.value.length"
            [maxChars]="CONDITIONS_MAX_LENGTH"
            position="right"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <p-message
          class=""
          [severity]="'secondary'"
          styleClass="custom-message"
          variant="simple"
          size="small"
          >* Campos requeridos</p-message
        >
      </div>

      <div class="flex flex-row gap-2 justify-end">
        <p-button
          [label]="saveLabel()"
          [loading]="saving()"
          icon="pi pi-save"
          size="small"
          [disabled]="settingsForm.invalid || saving()"
          (onClick)="save()"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent {
  readonly CONDITIONS_MAX_LENGTH = 1000;
  private fb = inject(FormBuilder);

  settings = input<Settings | null>(null);
  loading = input<boolean>(false);
  saving = input<boolean>(false);
  onSave = output<Settings>();

  settingsForm = this.fb.nonNullable.group({
    company_name: ['', Validators.required],
    phone: [''],
    address: [''],
    nif: [''],
    email: [''],
    iva: [21],
    conditions: [''],
  });

  saveLabel = computed(() => (this.saving() ? 'Guardando' : 'Guardar'));

  constructor() {
    effect(() => {
      if (this.settings() === null) return;
      this.settingsForm.patchValue(this.settings()!);
    });
  }

  save() {
    const settings = this.settingsForm.value as Settings;
    this.onSave.emit(settings);
  }
}
