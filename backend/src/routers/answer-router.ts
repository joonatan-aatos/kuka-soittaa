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
  const answersRaw = await prisma.answer.findMany({
    where: {
      eventId: event.id,
    },
    orderBy: {
      created: 'asc',
    },
    select: {
      accepted: true,
      comment: true,
      created: true,
      eventId: true,
      id: true,
      userName: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  const answers = answersRaw.map((answer) => ({
    ...answer,
    likes: answer._count?.likes,
    _count: undefined,
  }));
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

router.get('/liked/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400);
    return;
  }
  const event = await getNewestEvent();
  if (!event) {
    res.sendStatus(500);
    return;
  }
  const answers = await prisma.answer.findMany({
    where: {
      likes: {
        some: {
          userId,
        },
      },
      eventId: event.id,
    },
    select: {
      id: true,
    },
  });
  res.status(200).send(answers.map((answer) => answer.id));
});

router.post('/:id/like', async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;
  const answer = await prisma.answer.findUnique({
    where: {
      id,
    },
  });
  if (!answer) {
    res.status(400).send('Answer does not exist');
    return;
  }
  const existingLike = await prisma.like.findFirst({
    where: {
      answerId: id,
      userId,
    },
  });
  if (existingLike) {
    res.status(400).send('User already liked this answer');
    return;
  }
  const like = await prisma.like.create({
    data: {
      answerId: id,
      userId,
    },
  });
  assert(like, 'Like creation failed');
  res.sendStatus(200);
});

router.delete('/:id/like', async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;
  const like = await prisma.like.findFirst({
    where: {
      answerId: id,
      userId,
    },
  });
  if (!like) {
    res.status(400).send('User has not liked this answer');
    return;
  }
  await prisma.like.delete({
    where: {
      answerId_userId: {
        answerId: id,
        userId,
      },
    },
  });
  res.sendStatus(200);
});

export default router;
