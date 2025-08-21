import { Ripple } from 'primeng/ripple';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-menubar',
  imports: [MenubarModule, ButtonModule, Ripple],
  template: `
    <p-menubar [model]="items" styleClass="shadow-2xs">
      <ng-template pTemplate="end">
        <div
          class="p-menubar-item"
          role="menuitem"
          style="cursor: pointer;"
          (click)="authServive.logout()"
        >
          <div class="p-menubar-item-content">
            <a pRipple class="p-ripple p-menubar-item-link">
              <span class="p-menubar-item-icon pi pi-sign-out"></span>
              <span class="p-menubar-item-label hidden md:inline"
                >Cerrar sesión</span
              >
            </a>
          </div>
        </div>
      </ng-template>
    </p-menubar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarComponent implements OnInit {
  authServive = inject(AuthService);
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: 'home',
      },
      {
        label: 'Presupuestos',
        icon: 'pi pi-file',
        routerLink: '',
      },
      {
        label: 'Conceptos',
        icon: 'pi pi-bookmark',
        routerLink: 'items',
      },
      {
        label: 'Estados',
        icon: 'pi pi-flag',
        routerLink: '',
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: 'clients',
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: 'settings',
      },
    ];
  }
}
