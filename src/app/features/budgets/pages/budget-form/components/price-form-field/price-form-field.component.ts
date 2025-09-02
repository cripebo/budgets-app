import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SettingsState } from '@features/settings/settings.state';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-price-form-field',
  imports: [ReactiveFormsModule, InputNumberModule],
  template: `
    <form
      [formGroup]="parentFormGroup()"
      class="p-total-price-wrapper grid formgrid p-fluid pt-4 surface-border"
    >
      <div class="w-full flex justify-content-end">
        <div class="col-12 md:col-4">
          <h2 class="mt-0 mb-2 text-900 font-bold text-xl">Precio</h2>
        </div>
      </div>

      <div class="w-full flex justify-end">
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-medium">Subtotal sin IVA</label>
          <p-inputNumber
            mode="currency"
            currency="EUR"
            formControlName="subtotal"
            [readonly]="true"
            styleClass="subtotal"
          ></p-inputNumber>
        </div>
      </div>

      <div class="w-full flex justify-end">
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-medium">IVA</label>
          <p-inputNumber
            inputId="percent"
            suffix=" %"
            formControlName="iva"
            [min]="0"
            [max]="999"
          >
          </p-inputNumber>
        </div>
      </div>

      <div class="w-full flex justify-end">
        <div class="mb-4 flex gap-4 items-center">
          <label class="font-medium">Total</label>
          <p-inputNumber
            mode="currency"
            currency="EUR"
            locale="es-ES"
            formControlName="total"
            [readonly]="true"
            styleClass="subtotal total"
          ></p-inputNumber>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceFormFieldComponent {
  parentFormGroup = input.required<FormGroup>();
  settingsState = inject(SettingsState);
  settings = this.settingsState.settings;

  constructor() {
    effect(() => {
      this.parentFormGroup().patchValue({
        iva: this.settings()?.iva,
      });
    });
  }
}
