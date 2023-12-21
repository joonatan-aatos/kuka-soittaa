import { api, useApi } from './base';

export interface Answer {
  id?: string;
  userName?: string;
  eventId: string;
  userId: string;
  accepted: boolean;
  comment: string;
  created: string;
}

export const useAnswers = () => useApi<Answer[]>(['answers']);

export const createAnswer = async (
  userId: string,
  accepted: boolean,
  comment?: string,
) =>
  await api<Answer>(['answers'], {
    method: 'POST',
    body: JSON.stringify({
      userId,
      accepted,
      comment,
    }),
  });
