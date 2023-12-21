import { API_URL } from '@env';

export const getCallerImageSrc = (id: string): string =>
  `${API_URL}/caller/${id}/image`;

export const getCallerAudioSrc = (id: string): string =>
  `${API_URL}/caller/${id}/audio`;
