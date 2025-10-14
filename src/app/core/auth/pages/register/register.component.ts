import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { RegisterRequest } from '../../models/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SideContentInfoComponent } from '@core/auth/components/side-content-info/side-content-info.component';

@Component({
  selector: 'app-register',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    RouterLink,
    SideContentInfoComponent,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  authService = inject(AuthService);

  registerForm: FormGroup;
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor() {
    this.registerForm = this.fb.nonNullable.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
    });

    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.resetError());
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const credentials = this.registerForm.value as RegisterRequest;

    if (credentials.password !== credentials.repeatPassword) {
      this.errorMessage.set('Las contraseñas deben coincidir');
      return;
    }

    this.loading.set(true);

    this.authService
      .register(credentials)
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
      .subscribe((response) => {
        this.router.navigate(['/auth/login']);
      });
  }

  resetError() {
    this.errorMessage.set(null);
  }
}
