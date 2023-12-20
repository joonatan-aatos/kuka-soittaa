import express from 'express';
import cors from 'cors';
import { connect } from './util/prisma-client';
import userRouter from './routers/user-router';
import eventRouter from './routers/event-router';
import answerRouter from './routers/answer-router';
import callerRouter from './routers/caller-router';
import audioRouter from './routers/audio-router';
import { createJobs } from './scheduler/scheduler';
import adminRouter from './routers/admin-router';
import debug from './util/debug';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  debug(`${req.method} ${req.path}`);
  next();
});

app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/answers', answerRouter);
app.use('/caller', callerRouter);
app.use('/audio', audioRouter);
app.use('/admin', adminRouter);

connect().then(() =>
  app.listen(3000, () => {
    debug('Server is running on port 3000');
    createJobs();
  }),
);
