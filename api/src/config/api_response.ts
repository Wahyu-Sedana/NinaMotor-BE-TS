export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: {};
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: {};
}
