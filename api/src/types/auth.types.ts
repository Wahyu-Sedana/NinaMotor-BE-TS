export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nama: string;
  email: string;
  password: string;
  c_password: string;
  no_telp: string;
  role: string;
}
