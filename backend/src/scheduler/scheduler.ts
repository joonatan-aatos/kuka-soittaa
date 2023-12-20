import { RecurrenceRule, scheduleJob } from 'node-schedule';
import prisma from '../util/prisma-client';
import debug from '../util/debug';

export const createJobs = () => {
  // Add next event at the beginning of each day
  const rule = new RecurrenceRule();
  rule.hour = 0;
  rule.minute = 0;
  rule.second = 0;

  // Get random time between 10am and 10pm
  const randomTime = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const randomMilliseconds = (Math.random() * 12 + 10) * 60 * 60 * 1000;
    return new Date(date.getTime() + randomMilliseconds);
  };

  const randomCaller = async (): Promise<string | undefined> => {
    const callers = await prisma.caller.findMany({
      select: {
        id: true,
      },
    });
    if (callers.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * callers.length);
    return callers[randomIndex].id;
  };

  scheduleJob(rule, async () => {
    const callerId = await randomCaller();
    if (callerId) {
      debug('Creating next event');
      await prisma.event.create({
        data: {
          time: randomTime(),
          callerId,
        },
      });
    }
  });

  // Add events if there are none
  prisma.event.findMany().then(async (events: unknown[]) => {
    const nofCallers = await prisma.caller.count();
    if (events.length === 0 && nofCallers > 0) {
      // Create event for yesterday, today and tomorrow
      debug('Creating automatic events');
      const data = await Promise.all(
        [...Array(3).keys()]
          .map((i) => {
            const date = randomTime();
            date.setDate(date.getDate() - i);
            return date;
          })
          .map(async (time) => ({ time, callerId: (await randomCaller())! })),
      );

      await prisma.event.createMany({
        data,
      });
    }
  });
};
