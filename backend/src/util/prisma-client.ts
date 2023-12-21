import { PrismaClient } from '@prisma/client';
import debug from './debug';

const client = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const connect = async () => {
  await client
    .$connect()
    .then(() => debug('Connected to database'))
    .catch((e: unknown) => debug(e));
};

export default client;
