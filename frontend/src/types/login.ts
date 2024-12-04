import { withToken } from '@/types/entities/user';

export type LoginFormRequest = {
  account_name: string;
  password: string;
};

export type RegisterFormRequest = {
  account_name: string;
  password: string;
  confirm_password: string;
  govermentid: string;
  birth_date: Date;
};

export type RegisterFormResponse = {
  message: string;
};

export type LoginFormResponse = withToken;
