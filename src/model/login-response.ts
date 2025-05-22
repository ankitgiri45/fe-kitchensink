export interface TokenResponse {
  current: string;
  refresh: string;
}

export interface LoginResponse {
  email: string;
  token: TokenResponse;
  roles: string[];
}
