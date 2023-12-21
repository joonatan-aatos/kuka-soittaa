import { api, useApi } from './base';

export interface User {
  id?: string;
  name: string;
}

export const useUsers = () => useApi<User[]>(['users']);

export const useUser = (id: string) => useApi<User>(['users', id]);

export const createUser = async (name: string) =>
  await api<User>(['users'], {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
  });

export const updateUser = async (id: string, name: string) =>
  api<User>(['users', id], {
    method: 'PUT',
    body: JSON.stringify({
      name,
    }),
  });
