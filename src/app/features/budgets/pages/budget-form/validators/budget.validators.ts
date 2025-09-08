import { FormArray, FormGroup } from '@angular/forms';

const BUDGET_NAME_ERROR = 'El nombre del presupuesto es requerido';
const BUDGET_COMPANY_NAME_ERROR = 'El nombre de tu empresa es requerido';
const BUDGET_ITEMS_ERROR = 'Debe haber al menos un concepto en el presupuesto';
const BUDGET_CONDITIONS_ERROR =
  'Las condiciones no pueden contener solo espacios en blanco';

export function budgetIsValid(form: FormGroup): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const nameControl = form.get('name');
  if (!nameControl?.value?.trim()) {
    errors['name'] = BUDGET_NAME_ERROR;
  }

  const companyNameControl = form.get(['company', 'company-name']);
  if (!companyNameControl?.value?.trim()) {
    errors['company-name'] = BUDGET_COMPANY_NAME_ERROR;
  }

  const itemsControl = form.get('items') as FormArray | null;
  if (!itemsControl || itemsControl.length === 0) {
    errors['items'] = BUDGET_ITEMS_ERROR;
  }

  const conditionsControl = form.get('conditions');
  if (conditionsControl) {
    const value = conditionsControl.value ?? '';
    if (value !== '' && value.trim().length === 0) {
      errors['conditions'] = BUDGET_CONDITIONS_ERROR;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
