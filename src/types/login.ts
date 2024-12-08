import { loginToken } from '@/types/entities/user';

export type LoginFormRequest = {
  email: string;
  password: string;
};

export type RegisterFormRequest = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  tanggal_lahir: string;
  biografi: string;
};

export type RegisterFormResponse = {
  id: number;
  name: string;
  email: string;
  tanggal_lahir: string;
  biografi: string;
  created_at: string;
};

export type LoginFormResponse = loginToken;
