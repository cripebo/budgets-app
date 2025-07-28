import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../../shared/components/menubar/menubar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenubarComponent],
  template: `
    <div class="py-4 px-8 "><app-menubar /></div>
    <div class="container">
      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
