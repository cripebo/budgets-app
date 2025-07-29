import { Ripple } from 'primeng/ripple';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menubar',
  imports: [MenubarModule, ButtonModule, Ripple],
  template: `
    <p-menubar [model]="items" styleClass="shadow-2xs">
      <ng-template pTemplate="end">
        <div class="p-menubar-item" role="menuitem" style="cursor: pointer;">
          <div class="p-menubar-item-content">
            <a pRipple class="p-ripple p-menubar-item-link">
              <span class="p-menubar-item-icon pi pi-sign-out"></span>
              <span class="p-menubar-item-label">Cerrar sesión</span>
            </a>
          </div>
        </div>
      </ng-template>
    </p-menubar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenubarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '',
      },
      {
        label: 'Presupuestos',
        icon: 'pi pi-file',
        routerLink: '',
      },
      {
        label: 'Conceptos',
        icon: 'pi pi-bookmark',
        routerLink: '',
      },
      {
        label: 'Estados',
        icon: 'pi pi-flag',
        routerLink: '',
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        routerLink: '',
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: '',
      },
    ];
  }
}
