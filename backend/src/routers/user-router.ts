import { Router } from 'express';
import prisma from '../util/prisma-client';
import assert from 'assert';

const router = Router();

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
    },
  });
  res.status(200).send(users);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send(user);
});

router.post('/', async (req, res) => {
  const name: string = req.body.name;
  if (!name) {
    res.status(400).send('Name was not provided');
    return;
  }

  const user = await prisma.user.create({
    data: {
      name,
    },
  });

  assert(user, 'User creation failed');
  res.status(200).send(user);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  if (!name) {
    res.status(400).send('Name was not provided');
    return;
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  assert(user, 'User update failed');

  await prisma.answer.updateMany({
    where: {
      userId: id,
    },
    data: {
      userName: name,
    },
  });

  res.status(200).send(user);
});

export default router;
