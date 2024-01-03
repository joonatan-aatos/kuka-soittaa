import { useEffect, useState } from 'react';

export const backendUrl = process.env.REACT_APP_BACKEND_URL!;

let apiToken: string | undefined = undefined;

export const setApiToken = (token: string) => {
  apiToken = token;
};

const joinPaths = (path1: string, path2: string) =>
  `${path1.replace(/\/$/, '')}/${path2}`;

export const request = async <T>(
  path: (string | number)[],
  options?: RequestInit,
): Promise<T> => {
  const url = new URL(backendUrl);
  url.pathname = joinPaths(url.pathname, path.join('/'));
  const finalUrl = url.toString();

  return await fetch(finalUrl, {
    ...options,
    headers: {
      ...options?.headers,
      ...(apiToken ? { 'Admin-Token': apiToken } : {}),
    },
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    if (res.headers.get('Content-Type')?.includes('application/json')) {
      return res.json();
    } else {
      return res.text();
    }
  });
};

export const useRequest = <T>(
  path: (string | number)[],
  options?: RequestInit,
): { response: T | undefined; update: () => void } => {
  const [response, setResponse] = useState<T | undefined>(undefined);

  const update = () =>
    request<T>(path, options).then((data) => setResponse(data));

  useEffect(() => {
    if (!response) {
      request<T>(path, options).then((data) => setResponse(data));
    }
  }, [options, path, response]);

  return { response, update };
};
