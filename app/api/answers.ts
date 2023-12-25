import { api, useApi } from './base';

export interface Answer {
  id: string;
  userName: string;
  eventId: string;
  userId: string;
  accepted: boolean;
  comment: string;
  created: string;
  likes: number;
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

export const useLikedAnswers = (userId: string) =>
  useApi<string[]>(['answers', 'liked', userId]);

const like = async (
  userId: string,
  answerId: string,
  method: 'POST' | 'DELETE',
) =>
  await api<void>(['answers', answerId, 'like'], {
    method,
    body: JSON.stringify({
      userId,
    }),
  });

export const likeAnswer = async (userId: string, answerId: string) =>
  await like(userId, answerId, 'POST');

export const unlikeAnswer = async (userId: string, answerId: string) =>
  await like(userId, answerId, 'DELETE');
