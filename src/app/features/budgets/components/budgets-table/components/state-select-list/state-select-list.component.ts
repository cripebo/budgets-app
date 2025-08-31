import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { State } from '@features/states/models/states.model';
import { StatesState } from '@features/states/states.state';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-state-select-list',
  imports: [
    ListboxModule,
    FormsModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule,
  ],
  template: `
    <div class="flex flex-row flex-wrap gap-4 mb-8">
      @for (state of states(); track $index) {
        <label
          for="state-{{ state.id }}"
          class="flex flex-row gap-2 px-3 py-2 rounded-[8px] border-2 border-gray-200 cursor-pointer"
        >
          <p-radiobutton
            name="state"
            [value]="state.id"
            [(ngModel)]="selectedStateId"
            inputId="state-{{ state.id }}"
          ></p-radiobutton>
          <span class="font-semibold">{{ state.name }}</span>
        </label>
      }
    </div>
    <div class="flex justify-end gap-2">
      <p-button
        label="Cancelar"
        severity="secondary"
        (onClick)="dialogRef.close()"
        ariaLabel="Cancelar"
      />
      <p-button
        label="Aceptar"
        icon="pi pi-check"
        (onClick)="dialogRef.close(selectedStateId)"
        ariaLabel="Aceptar"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSelectListComponent {
  dialogRef = inject(DynamicDialogRef);
  statesState = inject(StatesState);
  states = this.statesState.states;
  activeState = input<State | null>(null);

  selectedStateId: number | null = null;

  constructor() {
    effect(() => {
      this.setInitialOptionSelected();
    });
  }

  setInitialOptionSelected() {
    if (this.activeState() === null) return;
    this.selectedStateId = this.activeState()!.id!;
  }
}
