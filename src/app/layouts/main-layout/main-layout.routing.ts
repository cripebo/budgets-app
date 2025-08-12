import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/home/pages/home/home.component';
import { ItemsComponent } from '@features/items/pages/items/items.component';
import { authGuard } from '@core/guards/auth.guard';

export const MainRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [authGuard],
  },
];
