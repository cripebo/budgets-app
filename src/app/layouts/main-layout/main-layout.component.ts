import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarComponent } from '../../shared/components/menubar/menubar.component';
import { AppInitService } from '@core/services/app-init.service';

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
export class MainLayoutComponent implements OnInit {
  private readonly appInitService = inject(AppInitService);

  ngOnInit(): void {
    this.appInitService.loadAll();
  }
}
