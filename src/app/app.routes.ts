import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./core/auth/auth.routing').then((m) => m.AuthRoutes),
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./layouts/main-layout/main-layout.routing').then(
        (m) => m.MainRoutes,
      ),
  },
];
