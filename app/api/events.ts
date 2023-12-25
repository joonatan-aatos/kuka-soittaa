import { useApi } from './base';

export interface Event {
  id: string;
  time: string;
  callerId: string;
  caller: { name: string };
}

interface EventObject {
  current?: Event;
  next?: Event;
}

export const useEvents = () => useApi<EventObject>(['events']);
