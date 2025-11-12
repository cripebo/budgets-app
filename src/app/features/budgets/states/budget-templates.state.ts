import { Injectable, signal, computed, Provider } from '@angular/core';
import { CLEARABLE_STATE } from '@core/state/cleareable-state.token';
import { BudgetTemplate } from '../models/budgets.model';

@Injectable({ providedIn: 'root' })
export class BudgetTemplatesState {
  private _templates = signal<BudgetTemplate[]>([]);
  private _loading = signal<boolean>(false);

  readonly templates = computed(() => this._templates());
  readonly loading = computed(() => this._loading());

  hasTemplates(): boolean {
    return this._templates().length > 0;
  }

  getById(id: number): BudgetTemplate | undefined {
    return this._templates().find((t) => t.id === id);
  }

  setTemplates(templates: BudgetTemplate[]) {
    this._templates.set(templates);
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  addTemplate(template: BudgetTemplate) {
    this._templates.update((prev) => [...prev, template]);
  }

  updateTemplate(template: BudgetTemplate) {
    this._templates.update((prev) =>
      prev.map((t) => (t.id === template.id ? template : t)),
    );
  }

  replaceTemplate(templateId: number, template: BudgetTemplate) {
    this._templates.update((previousCategories) => {
      const index = previousCategories.findIndex((t) => t.id === templateId);
      if (index === -1) return previousCategories;
      const updated = [...previousCategories];
      updated[index] = template;
      return updated;
    });
  }

  removeTemplate(id: number) {
    this._templates.update((prev) => prev.filter((t) => t.id !== id));
  }

  addOrUpdateTemplate(template: BudgetTemplate) {
    if (!template.id) {
      this.addTemplate(template);
      return;
    }

    const exists = this.getById(template.id);
    if (exists) {
      this.updateTemplate(template);
    } else {
      this.addTemplate(template);
    }
  }

  clear() {
    this._templates.set([]);
    this._loading.set(false);
  }
}

export const provideBudgetTemplatesState: Provider[] = [
  { provide: CLEARABLE_STATE, useExisting: BudgetTemplatesState, multi: true },
];
