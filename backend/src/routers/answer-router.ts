import { Router } from 'express';
import prisma from '../util/prisma-client';
import assert from 'assert';

const router = Router();

const getNewestEvent = async () => {
  const event = await prisma.event.findFirst({
    orderBy: {
      time: 'desc',
    },
    where: {
      time: {
        lte: new Date(),
      },
    },
  });
  return event;
};

router.get('/', async (_req, res) => {
  const event = await getNewestEvent();
  assert(event, 'No events found');
  const answers = await prisma.answer.findMany({
    where: {
      eventId: event.id,
    },
    orderBy: {
      created: 'desc',
    },
    select: {
      accepted: true,
      comment: true,
      created: true,
      eventId: true,
      id: true,
      userName: true,
    },
  });
  res.status(200).send(answers);
});

router.post('/', async (req, res) => {
  const event = await getNewestEvent();
  if (!event) {
    res.status(500).send('No events found');
    return;
  }

  const { userId, comment, accepted } = req.body;

  if (!userId) {
    res.status(400).send('Missing userId');
    return;
  }
  if (accepted === undefined) {
    res.status(400).send('Missing accepted');
    return;
  }

  const existingAnswer = await prisma.answer.findFirst({
    where: {
      eventId: event.id,
      userId,
    },
  });
  if (existingAnswer) {
    res.status(400).send('Answer already exists');
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    res.status(400).send('User does not exist');
    return;
  }

  const answer = await prisma.answer.create({
    data: {
      eventId: event.id,
      userName: user?.name,
      userId,
      comment,
      accepted,
    },
  });
  assert(answer, 'Answer creation failed');
  res.status(200).send(answer);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const comment = req.body.comment ?? '';
  const answer = await prisma.answer.update({
    where: {
      id,
    },
    data: {
      comment,
    },
  });
  assert(answer, 'Answer update failed');
  res.status(200).send(answer);
});

export default router;
