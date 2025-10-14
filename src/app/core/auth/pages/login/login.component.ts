import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCredentials } from '../../models/auth.model';
import { catchError, finalize, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenService } from '../../services/token.service';
import { SideContentInfoComponent } from '@core/auth/components/side-content-info/side-content-info.component';

@Component({
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    RouterLink,
    SideContentInfoComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  authService = inject(AuthService);
  tokenService = inject(TokenService);

  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor() {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.loginForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.resetError());
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value as UserCredentials;
    this.loading.set(true);

    this.authService
      .login(credentials)
      .pipe(
        catchError((error) => {
          if (error.status === 400 && error.error?.message?.includes('email')) {
            this.errorMessage.set('El correo ya está registrado.');
          } else {
            this.errorMessage.set('Ocurrió un error. Intenta nuevamente.');
          }
          return throwError(() => error);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }

  resetError() {
    this.errorMessage.set(null);
  }
}
