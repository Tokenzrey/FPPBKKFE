export type User = {
  id: number;
  name: string;
  email: string;
  tanggal_lahir: string;
  biografi: string;
};

export type loginToken = {
  token: string;
};

export type withToken = {
  refresh_token: string;
  refresh_token_expiration_time: string;
  token: string;
  token_expiration_time: string;
};
