import { useEffect, useState } from 'react';
import { API_URL, APP_VERSION } from '@env';

const headers = {
  'Content-Type': 'application/json',
  'App-Version': APP_VERSION,
};

export const useApi = <Type>(path: string[], options?: RequestInit) => {
  const [data, setData] = useState<Type | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number | undefined>(undefined);

  const url = `${API_URL}/${path.join('/')}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await fetch(url, {
        headers,
        ...options,
      });
      setStatus(res.status);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      } else {
        const data = await res.text();
        setError(data);
      }
      setIsLoading(false);
    };
    fetchData();
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

  const res = await fetch(url, {
    headers,
    ...options,
  });

  if (res.ok) {
    try {
      return (await res.json()) as Type;
    } catch (e) {
      return undefined;
    }
  }
  throw new Error(await res.text());
};
