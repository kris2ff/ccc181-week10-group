export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export type LoginErrors = Partial<Record<'email' | 'password', string>>;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResult {
  token: string;
  user: User;
}
