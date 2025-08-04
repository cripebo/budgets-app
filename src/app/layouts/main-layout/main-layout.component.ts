import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../../shared/components/menubar/menubar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenubarComponent],
  template: `
    <div class="lg:pt-8 lg:px-8"><app-menubar /></div>
    <main class="lg:pt-2 lg:px-8">
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
