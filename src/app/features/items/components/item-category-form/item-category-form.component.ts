import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsImportsModule } from '@features/budgets/modules/budget-form-imports.module';
import { MessageModule } from 'primeng/message';
import { ItemCategory } from '@features/items/models/items.model';
import { ToastService, ToastSeverity } from '@core/services/toast.service';

@Component({
  selector: 'app-item-category-form',
  imports: [InputTextModule, ButtonModule, FormsImportsModule, MessageModule],
  template: `
    <div class="flex flex-col gap-2">
      <form [formGroup]="categoryForm">
        <div class="flex flex-row gap-2">
          <input
            #categoryName
            pInputText
            id="category-name"
            aria-describedby="category-name"
            name="category-name"
            formControlName="name"
            placeholder="Nombre"
            class="flex-1"
            (input)="onNameChange($event)"
          />
          <p-button
            label="Crear"
            [outlined]="true"
            (onClick)="submit()"
            ariaLabel="Crear categoría"
            [disabled]="isInvalid('name')"
          />
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCategoryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  readonly existingCategories = input<ItemCategory[]>([]);
  readonly onSubmit = output<string>();

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });

  get nameControl() {
    return this.categoryForm.controls.name;
  }

  isInvalid(controlName: string) {
    const control = this.categoryForm.get(controlName);
    return !!(control?.touched && control.invalid);
  }

  onNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trimStart();
    this.nameControl.setValue(value, { emitEvent: false });
  }

  private nameExists(name: string): boolean {
    return this.existingCategories().some(
      (cat) => cat.name.toLowerCase() === name.trim().toLowerCase(),
    );
  }

  submit() {
    if (this.categoryForm.invalid) return;

    const categoryName = this.nameControl.value;

    if (!categoryName) return;

    if (this.nameExists(categoryName)) {
      this.toastService.show(
        ToastSeverity.warn,
        `Ups!`,
        `La categoría '${categoryName}' ya existe`,
      );
      return;
    }

    this.onSubmit.emit(categoryName);
    this.categoryForm.reset();
  }
}
