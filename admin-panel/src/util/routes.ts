import { request } from './api';
import { Caller, Event } from './types';

const headers = {
  'Content-Type': 'application/json',
};

export const getCallerList = () => request<Caller[]>(['caller'], undefined);
export const postCaller = (caller: FormData) =>
  request<Caller>(['caller'], {
    method: 'POST',
    body: caller,
  });
export const deleteCaller = (id: string) =>
  request<Caller>(['caller', id], { method: 'DELETE' });

export const getEventList = () =>
  request<Event[]>(['events', 'all'], undefined);
export const postEvent = (event: object) =>
  request<Event>(['events'], {
    method: 'POST',
    body: JSON.stringify(event),
  });
export const deleteEvent = (id: string) =>
  request<Event>(['events', id], { method: 'DELETE' });

export const getAudioList = () => request<string[]>(['audio'], undefined);
export const postAudio = (audio: FormData) =>
  request<string>(['audio'], {
    method: 'POST',
    body: audio,
  });
export const deleteAudio = (id: string) =>
  request<string>(['audio', id], { method: 'DELETE' });

export const checkAdminToken = (token: string) =>
  request<boolean>(['admin', 'login'], {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers,
  });
