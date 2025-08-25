import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { State } from '@features/states/models/states.model';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ColorPickerModule } from 'primeng/colorpicker';
import { StateChipComponent } from '@features/states/components/state-chip/state-chip.component';

@Component({
  selector: 'app-state-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    MessageModule,
    ColorPickerModule,
    StateChipComponent,
  ],
  template: `
    <div class="flex flex-col gap-2 mb-4">
      <h2 class="font-semibold">Previsualización</h2>
      <div>
        <app-state-chip
          [colorBackground]="stateForm.controls['colorBackground'].value"
          [colorText]="stateForm.controls['colorText'].value"
          [text]="stateForm.controls['name'].value"
        />
      </div>
    </div>
    <form [formGroup]="stateForm" class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="item-name">Nombre</label>
          <input
            pInputText
            id="item-name"
            aria-describedby="item-name-help"
            formControlName="name"
          />
          <p-message
            class=""
            [severity]="
              stateForm.controls['name'].touched &&
              stateForm.controls['name'].invalid
                ? 'error'
                : 'secondary'
            "
            styleClass="custom-message"
            variant="simple"
            size="small"
            >{{
              stateForm.controls['name'].touched &&
              stateForm.controls['name'].invalid
                ? 'El nombre del estado es requerido'
                : 'Introduce el nombre del estado'
            }}</p-message
          >
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div class="flex gap-2">
            <p-colorpicker
              styleClass="custom-color-picker"
              formControlName="colorText"
              appendTo="body"
              inputId="color-text"
            />
            <label for="color-text" class="cursor-pointer"
              >Color del texto</label
            >
          </div>
          <div class="flex gap-2">
            <p-colorpicker
              styleClass="custom-color-picker"
              formControlName="colorBackground"
              appendTo="body"
              inputId="color-background"
            />
            <label for="color-background" class="cursor-pointer"
              >Color del fondo</label
            >
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <p-button
          [label]="isEditMode ? 'Editar' : 'Crear'"
          [icon]="isEditMode ? 'pi pi-pencil' : 'pi pi-plus'"
          [disabled]="stateForm.invalid"
          (onClick)="isEditMode ? edit() : create()"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFormComponent {
  private DEFAULT_BACKGROUND = '#6b707d';
  private DEFAULT_TEXT = '#ffffff';

  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);

  state = input<State | null>(null);

  stateForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    colorText: [this.DEFAULT_TEXT, [Validators.required]],
    colorBackground: [this.DEFAULT_BACKGROUND, [Validators.required]],
    removable: [true, [Validators.required]],
  });

  get isEditMode() {
    return !!this.state();
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.stateForm.patchValue(this.state()!);
    }
  }

  create() {
    if (this.stateForm.invalid) return;
    const formValue = this.stateForm.value;

    this.dialogRef.close(formValue);
  }

  edit() {
    if (this.stateForm.invalid) return;
    const formValue = this.stateForm.value;

    this.dialogRef.close({ id: this.state()!.id, ...formValue });
  }
}
