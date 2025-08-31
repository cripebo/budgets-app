import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ClientFormFieldsComponent } from './components/client-form-fields/client-form-fields.component';
import { CompanyFormFieldComponent } from './components/company-form-field/company-form-field.component';
import { SelectModule } from 'primeng/select';
import { ItemsFormTableComponent } from './components/items-form-table/items-form-table.component';
import { ItemsService } from '@features/items/items.service';
import { ClientsService } from '@features/clients/clients.service';
import { ConditionsFormFieldsComponent } from './components/conditions-form-fields/conditions-form-fields.component';
import { BudgetsService } from '@features/budgets/budgets.service';
import { Budget, BudgetPrice } from '@features/budgets/models/budgets.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { BudgetCalculatorService } from '@features/budgets/services/budget-calculator.service';

@Component({
  selector: 'app-budget-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    ClientFormFieldsComponent,
    CompanyFormFieldComponent,
    SelectModule,
    ItemsFormTableComponent,
    ConditionsFormFieldsComponent,
    InputNumberModule,
  ],
  template: `
    <div class="box-container">
      <h1 class="font-bold text-xl pb-4">Crear un nuevo presupuesto</h1>
      <form [formGroup]="budgetForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 divide-y divide-gray-200">
          <div class="flex flex-col gap-2 pb-8">
            <label for="client-name" class="font-semibold text-md"
              >Nombre del presupuesto*</label
            >
            <input
              pInputText
              id="client-name"
              aria-describedby="client-name-help"
              formControlName="name"
            />
          </div>

          <app-company-form-field [parentFormGroup]="budgetForm" />
          <app-client-form-fields [parentFormGroup]="budgetForm" />
          <app-items-form-table [parentFormGroup]="budgetForm" />
          <app-conditions-form-fields [parentFormGroup]="budgetForm" />

          <form
            [formGroup]="priceForm"
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
        </div>

        <div class="flex justify-end">
          <p-button
            [label]="'Crear presupuesto'"
            [icon]="'pi pi-check'"
            (onClick)="create()"
            [loading]="saving()"
          />
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private itemsService = inject(ItemsService);
  private clientsService = inject(ClientsService);
  private budgetService = inject(BudgetsService);
  private budgetCalculatorService = inject(BudgetCalculatorService);
  saving = signal(false);

  budgetForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: this.fb.nonNullable.group({
      'company-name': [''],
      'company-address': [''],
      'company-nif': [''],
      'company-phone': [''],
      'company-email': [''],
    }),
    client: this.fb.nonNullable.group({
      'client-name': [''],
      'client-address': [''],
      'client-phone': [''],
      'client-email': [''],
    }),
    items: this.fb.array([]),
    conditions: [''],
  });

  priceForm = this.fb.nonNullable.group({
    subtotal: [0],
    iva: [0],
    total: 0,
  });

  itemsArray = this.budgetForm.get('items') as FormArray;
  itemsChanged = toSignal(this.itemsArray.valueChanges, {
    initialValue: (this.budgetForm.get('items') as FormArray).value,
  });

  ivaControl = this.priceForm.get('iva')!;
  ivaChanged = toSignal(this.ivaControl.valueChanges, {
    initialValue: this.ivaControl.value ?? 0,
  });

  constructor() {
    effect(() => {
      const { total, subtotal } = this.budgetCalculatorService.calculatePrice(
        this.itemsChanged(),
        this.ivaChanged(),
      );
      this.priceForm.patchValue({ total, subtotal });
    });
  }

  ngOnInit(): void {
    this.itemsService.loadAll();
    this.clientsService.loadAll();
  }

  create() {
    const budget = this.budgetForm.value as Budget;
    const price = this.priceForm.value as BudgetPrice;

    this.saving.set(true);
    this.budgetService
      .createBudget({ ...budget, price })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((response) => {
        if (!response?.success) return;

        this.router.navigate(['/budgets']);
      });
  }
}
