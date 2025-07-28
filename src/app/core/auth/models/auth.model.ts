export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  repeatPassword: string;
}

export interface RegisterResponse {
  message: string;
}
