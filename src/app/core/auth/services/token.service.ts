import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'token';
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  hasToken = computed(() => !!this._token());

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._token.set(token);
  }

  getToken(): string | null {
    return this._token();
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
  }

  isLoggedIn(): boolean {
    return !!this._token();
  }
}
