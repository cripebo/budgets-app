import { inject, Injectable } from '@angular/core';
import {
  LoginResponse,
  RegisterResponse,
  UserCredentials,
} from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: UserCredentials) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      credentials,
    );
  }

  register(credentials: UserCredentials) {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/register`,
      credentials,
    );
  }
}
