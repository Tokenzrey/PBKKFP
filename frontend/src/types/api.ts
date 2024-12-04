// /types/api.ts

export interface ApiSuccess<T = any> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Types for Register Form Responses
export type RegisterFormResponse =
  | ApiSuccess<{ accountName: string }>
  | ApiError;
