import { inject, Injectable } from '@angular/core';
import {
  LoginResponse,
  RegisterResponse,
  UserCredentials,
} from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = environment.apiUrl;

  readonly isAuthenticated = this.tokenService.hasToken;

  login(credentials: UserCredentials) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.tokenService.setToken(response.data)));
  }

  register(credentials: UserCredentials) {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/register`,
      credentials,
    );
  }

  logout() {
    this.tokenService.removeToken();
  }
}
