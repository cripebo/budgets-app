import { Routes } from '@angular/router';

export const BudgetsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/budgets/budgets.component').then(
        (m) => m.BudgetsComponent,
      ),
  },
  {
    path: 'budget-form',
    loadComponent: () =>
      import('./pages/budget-form/budget-form.component').then(
        (m) => m.BudgetFormComponent,
      ),
  },
];
