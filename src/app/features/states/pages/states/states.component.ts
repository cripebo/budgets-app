import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { State } from '@features/states/models/states.model';
import { StatesService } from '@features/states/states.service';
import { StatesState } from '@features/states/states.state';
import { ButtonModule } from 'primeng/button';
import { StatesTableComponent } from '@features/states/components/states-table/states-table.component';
import { StatesActionsComponent } from '@features/states/components/states-actions/states-actions.component';
import { ModalHandler } from '@shared/modals/modal-handler';
import { DialogService } from 'primeng/dynamicdialog';
import { StateFormComponent } from '../state-form/state-form.component';
import { DeleteStateFormComponent } from '../delete-state-form/delete-state-form.component';

@Component({
  selector: 'app-states',
  imports: [ButtonModule, StatesTableComponent, StatesActionsComponent],
  providers: [DialogService],
  template: `
    <div class="box-container">
      <div class="border-b border-surface flex flex-col gap-4 pb-4">
        <h1 class="text-xl font-bold">Estados</h1>
        <h3 class="text-sm sm:text-normal font-normal">
          Puede crear y editar los estados para tus presupuestos en esta página
        </h3>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row mt-4">
        <div>
          <app-states-actions (onCreate)="createStateModal()" />
        </div>
        <div class="flex-1">
          <app-states-table
            [states]="states()"
            [loading]="loading()"
            (onEdit)="editStateModal($event)"
            (onDelete)="deleteClientModal($event)"
          />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatesComponent extends ModalHandler implements OnInit {
  statesService = inject(StatesService);
  statesState = inject(StatesState);
  states = this.statesState.states;
  loading = this.statesState.loading;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.statesService.loadAll();
  }

  createStateModal() {
    this.openModal(StateFormComponent, {
      header: 'Crear estado',
      onClose: (result: State) => {
        if (result) this.statesService.createState(result);
      },
    });
  }

  editStateModal(stateId: number) {
    const state = this.statesState.getById(stateId);

    this.openModal(StateFormComponent, {
      header: 'Editar estado',
      inputValues: { state },
      onClose: (result: State) => {
        if (result) this.statesService.updateState(result);
      },
    });
  }

  deleteClientModal(stateId: number) {
    const state = this.statesState.getById(stateId);

    this.openModal(DeleteStateFormComponent, {
      header: 'Eliminar estado',
      inputValues: { state },
      onClose: (result: State) => {
        if (result) this.statesService.deleteState(result.id!);
      },
    });
  }
}
