import { Routes } from '@angular/router';
import { HomeComponent } from '../../features/home/pages/home/home.component';
import { ItemsComponent } from '@features/items/pages/items/items.component';
import { authGuard } from '@core/guards/auth.guard';
import { ClientsComponent } from '@features/clients/pages/clients/clients.component';
import { SettingsComponent } from '@features/settings/pages/settings/settings.component';

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
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
  },
];
