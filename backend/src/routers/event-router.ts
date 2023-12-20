import { Router } from 'express';
import prisma from '../util/prisma-client';
import { requireAdminToken } from '../util/util';

const router = Router();

router.get('/', async (_req, res) => {
  const nextEvent = await prisma.event.findFirst({
    orderBy: {
      time: 'asc',
    },
    where: {
      time: {
        gt: new Date(),
      },
    },
  });
  const currentEvent = await prisma.event.findFirst({
    orderBy: {
      time: 'desc',
    },
    where: {
      time: {
        lt: new Date(),
      },
    },
  });
  res.status(200).send({ current: currentEvent, next: nextEvent });
});

router.get('/all', requireAdminToken, async (_req, res) => {
  const events = await prisma.event.findMany({
    orderBy: {
      time: 'asc',
    },
  });
  res.status(200).send(events);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.sendStatus(400);
    return;
  }

  const event = await prisma.event.findUnique({
    where: {
      id,
    },
  });

  if (event) {
    res.status(200).send(event);
  } else {
    res.sendStatus(400);
  }
});

router.post('/', requireAdminToken, async (req, res) => {
  const { time, callerId } = req.body;

  if (!time || !callerId) {
    res.sendStatus(400);
    return;
  }

  const timeDate = new Date(time);

  if (timeDate < new Date()) {
    res.sendStatus(400);
    return;
  }

  const event = await prisma.event.create({
    data: {
      time: timeDate,
      callerId,
    },
  });

  res.status(200).send(event);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.sendStatus(400);
    return;
  }

  const event = await prisma.event.delete({
    where: {
      id,
    },
  });

  if (event) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

export default router;
