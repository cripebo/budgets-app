import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Item } from '@features/items/models/items.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { ItemCategoriesState } from '@features/items/states/item-categories.state';

@Component({
  selector: 'app-item-form',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    MessageModule,
    SelectModule,
  ],
  template: `
    <form [formGroup]="itemForm" class="flex flex-col gap-4">
      <div class="grid grid-cols-1 gap-4">
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
              itemForm.controls['name'].touched &&
              itemForm.controls['name'].invalid
                ? 'error'
                : 'secondary'
            "
            styleClass="custom-message"
            variant="simple"
            size="small"
            >{{
              itemForm.controls['name'].touched &&
              itemForm.controls['name'].invalid
                ? 'El nombre del concepto es requerido'
                : 'Introduce el nombre del concepto'
            }}</p-message
          >
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="currency-price">Precio</label>
          <p-inputnumber
            mode="currency"
            inputId="currency-price"
            currencyDisplay="symbol"
            currency="EUR"
            [minFractionDigits]="2"
            [showClear]="true"
            formControlName="price"
          />
          <p-message
            class=""
            [severity]="
              itemForm.controls['price'].touched &&
              itemForm.controls['price'].invalid
                ? 'error'
                : 'secondary'
            "
            styleClass="custom-message"
            variant="simple"
            size="small"
            >{{
              itemForm.controls['price'].touched &&
              itemForm.controls['price'].invalid
                ? 'El precio del concepto es requerido'
                : 'Establece el precio del concepto'
            }}</p-message
          >
        </div>
        <div class="flex flex-col gap-2">
          <label for="currency-price">Categoría</label>
          <p-select
            formControlName="category_id"
            [options]="categories()"
            [checkmark]="true"
            [showClear]="true"
            optionLabel="name"
            optionValue="id"
            placeholder="Sin categoría"
            class="w-full"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <p-button
          [label]="isEditMode ? 'Editar' : 'Crear'"
          [icon]="isEditMode ? 'pi pi-pencil' : 'pi pi-plus'"
          [disabled]="itemForm.invalid"
          (onClick)="isEditMode ? edit() : create()"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);

  item = input<Item | null>(null);
  categories = input<ItemCategoriesState[]>([]);

  itemForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required]],
    category_id: this.fb.control<number | null>(null),
  });

  get isEditMode() {
    return !!this.item();
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.itemForm.patchValue(this.item()!);
    }
  }

  create() {
    if (this.itemForm.invalid) return;
    const formValue = this.itemForm.value;

    this.dialogRef.close({ ...formValue });
  }

  edit() {
    if (this.itemForm.invalid) return;
    const formValue = this.itemForm.value;

    this.dialogRef.close({
      id: this.item()!.id,
      ...formValue,
    });
  }
}
