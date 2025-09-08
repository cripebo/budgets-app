import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ClientFormFieldsComponent } from './components/client-form-fields/client-form-fields.component';
import { CompanyFormFieldComponent } from './components/company-form-field/company-form-field.component';
import { ItemsFormTableComponent } from './components/items-form-table/items-form-table.component';
import { ItemsService } from '@features/items/items.service';
import { ClientsService } from '@features/clients/clients.service';
import { ConditionsFormFieldsComponent } from './components/conditions-form-fields/conditions-form-fields.component';
import { BudgetsService } from '@features/budgets/budgets.service';
import { Budget, BudgetPrice } from '@features/budgets/models/budgets.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { BudgetCalculatorService } from '@features/budgets/services/budget-calculator.service';
import { ToastService, ToastSeverity } from '@core/services/toast.service';
import { budgetIsValid } from './validators/budget.validators';
import { PriceFormFieldComponent } from './components/price-form-field/price-form-field.component';
import { FormsImportsModule } from '@features/budgets/modules/budget-form-imports.module';

@Component({
  selector: 'app-budget-form',
  imports: [
    FormsImportsModule,
    ClientFormFieldsComponent,
    CompanyFormFieldComponent,
    ItemsFormTableComponent,
    ConditionsFormFieldsComponent,
    PriceFormFieldComponent,
  ],
  template: `
    <div class="box-container">
      <h1 class="font-semibold text-xl pb-4">Crear un nuevo presupuesto</h1>
      <form [formGroup]="budgetForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 divide-y divide-gray-200">
          <div class="flex flex-col gap-2 pb-8">
            <label for="client-name" class="font-normal text-md"
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
          <app-price-form-field [parentFormGroup]="priceForm" />

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
            (onClick)="create()"
            [loading]="saving()"
            [disabled]="saving()"
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
  private toastService = inject(ToastService);
  saving = signal(false);

  budgetForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: this.fb.nonNullable.group({
      'company-name': ['', Validators.required],
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
    const { valid, errors } = budgetIsValid(this.budgetForm);

    if (!valid) {
      this.showBudgetErrors(errors);
      return;
    }

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

  showBudgetErrors(errors: Record<string, string>) {
    const warningTitle = 'Campos inválidos';
    Object.values(errors).forEach((error) => {
      this.toastService.show(ToastSeverity.warn, warningTitle, error);
    });
  }
}
