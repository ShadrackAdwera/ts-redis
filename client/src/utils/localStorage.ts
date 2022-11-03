import { TUserData } from './types';

const LOCAL_STORAGE_KEY = 'current-user';

export const fetchFromLocalStorage = (): TUserData | null => {
  const user = localStorage.getItem(LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const setToLocalStorage = (user: TUserData) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
};

export const clearLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
