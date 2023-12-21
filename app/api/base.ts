import { useEffect, useState } from 'react';
import { API_URL, APP_VERSION } from '@env';

const headers = {
  'Content-Type': 'application/json',
  'App-Version': APP_VERSION,
};

export const useApi = <Type>(path: string[], options?: RequestInit) => {
  const [data, setData] = useState<Type | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | undefined>(undefined);

  const url = `${API_URL}/${path.join('/')}`;

  useEffect(() => {
    fetch(url, {
      headers,
      ...options,
    })
      .then(async (res) => {
        setStatus(res.status);
        if (res.ok) return res.json();
        return Promise.reject(await res.text());
      })
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      });
  }, [url, options]);

  return {
    data,
    error,
    isLoading,
    status,
  };
};

export const api = async <Type>(path: string[], options?: RequestInit) => {
  const url = `${API_URL}/${path.join('/')}`;

  return (await fetch(url, {
    headers,
    ...options,
  })
    .then(async (res) => {
      if (res.ok) return res.json();
      throw new Error(await res.text());
    })
    .catch((err) => console.error(err))) as Promise<Type>;
};
