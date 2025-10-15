import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalHandler } from '@shared/modals/modal-handler';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ItemsSelectComponent } from '../items-select/items-select.component';
import { Item } from '@features/items/models/items.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-items-form-table',
  imports: [
    TableModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  providers: [DialogService],
  template: `
    <div class="flex flex-col gap-2 pb-8">
      <div class="flex justify-between">
        <label for="client-name" class="font-semibold text-xl"
          >Conceptos*</label
        >
        <p-button
          [label]="'Añadir concepto'"
          [icon]="'pi pi-plus'"
          [outlined]="true"
          (onClick)="selectItem()"
        />
      </div>

      <form [formGroup]="parentFormGroup()">
        <p-table [value]="itemsControls()">
          <ng-template #header>
            <tr>
              <th class="w-full text-black/60 font-semibold">Nombre</th>
              <th class="text-black/60 font-semibold">Precio</th>
              <th class="text-black/60 font-semibold">Cantidad</th>
              <th class="text-black/60 font-semibold">Unidad</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template
            #body
            let-item
            let-rowIndex="rowIndex"
            formArrayName="items"
          >
            <tr formGroupName="{{ rowIndex }}">
              <td>
                {{ item.value.name }}
              </td>
              <td>
                <div>
                  <p>
                    <p-inputnumber
                      mode="currency"
                      inputId="item-b-p-{{ rowIndex }}"
                      currencyDisplay="symbol"
                      currency="EUR"
                      [minFractionDigits]="2"
                      size="small"
                      formControlName="price"
                    />
                  </p>
                </div>
              </td>
              <td>
                <div>
                  <p-inputNumber
                    inputId="item-b-q-{{ rowIndex }}"
                    formControlName="quantity"
                    [fluid]="true"
                    size="small"
                    [min]="MIN_QUANTITY"
                    [max]="MAX_QUANTITY"
                  ></p-inputNumber>
                </div>
              </td>
              <td>
                <div>
                  <p>
                    <input
                      pInputText
                      id="item-b-u-{{ rowIndex }}"
                      pSize="small"
                      formControlName="unit"
                    />
                  </p>
                </div>
              </td>

              <td>
                <p-button
                  icon="pi pi-trash"
                  severity="secondary"
                  rounded
                  size="small"
                  [outlined]="true"
                  (onClick)="deleteItemFromBudget(rowIndex)"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template #emptymessage>
            <tr>
              <td class="w-full" colspan="5">
                <div class="flex flex-row gap-2 items-center justify-center">
                  <p class="text-center text-sm">No se han añadido conceptos</p>
                  <p-button
                    [icon]="'pi pi-plus'"
                    [outlined]="true"
                    severity="secondary"
                    size="small"
                    rounded
                    (onClick)="selectItem()"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </form>
    </div>
  `,
  styles: `
    :host ::ng-deep .p-datatable-thead > tr > th {
      padding-left: 0 !important;
    }

    :host ::ng-deep .p-datatable-tbody > tr > td {
      padding-left: 0;
      padding-top: 6px;
      padding-bottom: 6px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsFormTableComponent extends ModalHandler {
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  // Constans for default values
  private readonly DEFAULT_QUANTITY = 1;
  private readonly DEFAULT_UNIT = 'unidad';
  readonly MIN_QUANTITY = 1;
  readonly MAX_QUANTITY = 999;

  parentFormGroup = input.required<FormGroup>();

  itemsControls = computed(() => {
    const itemsArray = this.parentFormGroup().get('items') as FormArray;
    return itemsArray?.controls || [];
  });

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  selectItem() {
    this.openModal(ItemsSelectComponent, {
      header: 'Añadir concepto',
      onClose: (item: Item) => this.addItemToBudget(item),
    });
  }

  addItemToBudget(item: Item): void {
    if (!item?.name || item?.price === undefined) return;

    const itemsArray = this.parentFormGroup().get('items') as FormArray;
    if (!itemsArray) return;

    itemsArray.push(
      this.fb.group({
        name: [item.name, Validators.required],
        price: [item.price, Validators.required],
        quantity: [this.DEFAULT_QUANTITY, Validators.required],
        unit: [this.DEFAULT_UNIT, Validators.required],
      }),
    );

    this.cdr.detectChanges();
  }

  deleteItemFromBudget(index: number): void {
    const itemsArray = this.parentFormGroup().get('items') as FormArray;
    itemsArray?.removeAt(index);
  }
}
