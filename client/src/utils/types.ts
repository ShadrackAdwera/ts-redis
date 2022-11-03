export type TAuth = {
  username?: string;
  email: string;
  password: string;
};

export type TAuthResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    token: string;
  };
};

export enum queryKeys {
  USER = 'user',
  TASKS = 'tasks',
}

export type TUser = {
  id: string;
  email: string;
  token: string;
};
