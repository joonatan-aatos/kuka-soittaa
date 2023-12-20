import { Router } from 'express';
import debug from '../util/debug';

const router = Router();

router.post('/login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(200).send(false);
    return;
  }

  if (!process.env.ADMIN_TOKEN) {
    debug('No admin token set in environment variables!');
    res.status(200).send(false);
  }

  if (token === process.env.ADMIN_TOKEN) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

export default router;
