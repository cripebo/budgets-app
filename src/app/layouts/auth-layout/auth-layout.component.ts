import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <main class="h-screen sm:flex justify-center items-center lg:pt-8 lg:px-8">
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
