import { randomUUID } from 'crypto';
import { Router } from 'express';
import { mkdirSync, unlink } from 'fs';
import prisma from '../util/prisma-client';
import multer from 'multer';
import path from 'path';
import appRootPath from 'app-root-path';
import { requireAdminToken } from '../util/util';

const router = Router();
const uploadsDestination = 'uploads/';
const imagesDestination = `${uploadsDestination}images/`;
const audioDestination = `${uploadsDestination}audio/`;
const defaultAudioPath = 'defaults/audio.wav';
// const defaultImagePath = 'defaults/image.png';

const storage = multer.diskStorage({
  destination(_req, file, callback) {
    const extname = path.extname(file.originalname);
    const imageFormats = ['.jpg', '.jpeg', '.png'];
    if (imageFormats.includes(extname)) {
      mkdirSync(imagesDestination, { recursive: true });
      callback(null, imagesDestination);
    } else {
      callback(new Error('Unsupported file format'), uploadsDestination);
    }
  },
  filename(_req, file, callback) {
    const id = randomUUID();
    const extname = path.extname(file.originalname);
    const name = id + extname;
    callback(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

router.get('/', requireAdminToken, async (req, res) => {
  try {
    const callers = await prisma.caller.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    res.send(callers);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/:id/image', async (req, res) => {
  try {
    const caller = await prisma.caller.findUnique({
      where: { id: req.params.id },
      select: { imagePath: true },
    });
    if (!caller) {
      res.sendStatus(404);
      return;
    }
    const absolutePath = `${appRootPath}/${caller.imagePath}`;
    res.sendFile(absolutePath);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/:id/audio', async (req, res) => {
  try {
    const caller = await prisma.caller.findUnique({
      where: { id: req.params.id },
      select: { audioPath: true },
    });
    if (!caller) {
      res.sendStatus(404);
      return;
    }
    const absolutePath = `${appRootPath}/${caller.audioPath}`;
    res.sendFile(absolutePath);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post(
  '/',
  requireAdminToken,
  upload.single('image'),
  async (req, res) => {
    try {
      const file = req.file;
      const name = req.body.name;
      if (!file || !name) {
        res.sendStatus(400);
        return;
      }
      const id = path.parse(file.filename).name;
      const caller = await prisma.caller.create({
        data: {
          id,
          name,
          imagePath: `${imagesDestination}${file.filename}`,
          audioPath: req.body.audio
            ? `${audioDestination}${req.body.audio}`
            : defaultAudioPath,
        },
      });
      res.send(caller);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  },
);

router.delete('/:id', requireAdminToken, async (req, res) => {
  try {
    const caller = await prisma.caller.findUnique({
      where: { id: req.params.id },
    });
    if (!caller) {
      res.sendStatus(404);
      return;
    }
    const imagePath = `${appRootPath}/${caller.imagePath}`;
    unlink(imagePath, async (err) => {
      if (err) {
        throw new Error(`Error deleting file: ${err}`);
      }
      await prisma.caller.delete({
        where: {
          id: caller.id,
        },
      });
      res.sendStatus(200);
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

export default router;
