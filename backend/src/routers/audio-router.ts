import appRootPath from 'app-root-path';
import { Router } from 'express';
import { existsSync, mkdirSync, readdir } from 'fs';
import multer from 'multer';
import path from 'path';
import { requireAdminToken } from '../util/util';

const router = Router();
const uploadsDestination = 'uploads/audio/';
const defaultAudioPath = 'defaults/audio.wav';
const defaultImagePath = 'defaults/image.png';

const storage = multer.diskStorage({
  destination(_req, file, callback) {
    const extname = path.extname(file.originalname);
    const audioFormats = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
    if (audioFormats.includes(extname)) {
      mkdirSync(uploadsDestination, { recursive: true });
      callback(null, uploadsDestination);
    } else {
      callback(new Error('Unsupported file format'), '');
    }
  },
  filename(req, file, callback) {
    const id = req.body.name;
    const extname = path.extname(file.originalname);
    const name = id + extname;
    if (existsSync(`${uploadsDestination}${name}`)) {
      callback(new Error('File already exists'), '');
      return;
    }
    callback(null, name);
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

router.get('/', requireAdminToken, (_req, res) => {
  readdir(uploadsDestination, (err, files) => {
    if (err) {
      res.send([]);
      return;
    }
    res.send(files);
  });
});

router.get('/:name', requireAdminToken, (req, res) => {
  const name = req.params.name;
  const filePath = `${appRootPath}/${uploadsDestination}${name}`;
  if (existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  '/',
  requireAdminToken,
  upload.single('audio'),
  async (req, res) => {
    try {
      if (!req.file) {
        res.sendStatus(400);
        return;
      }
      res.send(req.file.filename);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  },
);

export default router;
