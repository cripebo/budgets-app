import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { State } from '@features/states/models/states.model';
import { StateChipComponent } from '@features/states/components/state-chip/state-chip.component';
import { ButtonModule } from 'primeng/button';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { StateSelectListComponent } from '../state-select-list/state-select-list.component';

@Component({
  selector: 'app-budgets-table-state-with-action',
  imports: [StateChipComponent, ButtonModule],
  providers: [DialogService],
  template: `
    <div class="flex gap-2 items-center">
      <p-button
        size="small"
        icon="pi pi-pencil"
        [rounded]="true"
        severity="secondary"
        (onClick)="editStateModal()"
        ariaLabel="Editar estado"
      />
      <app-state-chip
        [text]="activeState().name"
        [colorBackground]="activeState().colorBackground"
        [colorText]="activeState().colorText"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsTableStateWithActionComponent extends ModalHandler {
  activeState = input.required<State>();
  onChangedState = output<number>();

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  editStateModal() {
    this.openModal(StateSelectListComponent, {
      header: 'Cambiar estado',
      width: '25vw',
      breakpoints: {
        '1000px': '50vw',
        '600px': '100%',
      },
      inputValues: {
        activeState: this.activeState(),
      },
      onClose: (newStateId: number) => {
        if (newStateId) this.onChangedState.emit(newStateId);
      },
    });
  }
}
