export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nama: string;
  email: string;
  password: string;
  cPassword: string;
  noTelp: string;
}
