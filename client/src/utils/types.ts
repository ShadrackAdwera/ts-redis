export type TAuth = {
  username?: string;
  email: string;
  password: string;
};

export type TUserData = {
  id: string;
  email: string;
  token: string;
};

export type TAuthResponse = {
  message: string;
  user: {
    id: string;
    email: string;
    token: string;
  };
};

export type TTasks = {
  id: string;
  title: string;
  description: string;
  status: string;
  image: string;
};

export type INewTask = {
  title: string;
  description: string;
  image: string;
};

export type TMutateProps = {
  isLoading: boolean;
  isOpenDrawer: boolean;
  dismissDrawer: () => void;
  openDrawer: () => void;
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
