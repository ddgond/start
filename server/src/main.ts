import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import apiRouter from './apiRoutes/index.js';
import { env } from './env.js';

const isInContainer = env.HOST_PORT !== undefined;
const expressApp = express();

expressApp.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // max requests per window
    message: 'Too many requests, please try again later.',
  })
);
expressApp.set('trust proxy', 1);
expressApp.use(helmet());
expressApp.use('/api', apiRouter);

async function main() {
  const internalPort = 3000;
  const server = expressApp.listen(internalPort, '0.0.0.0', () => {
    if (isInContainer) {
      console.log(
        `Server is running on host at http://localhost:${env.HOST_PORT}.`
      );
    } else {
      console.log(`Server is running on port ${internalPort}`);
    }
  });
}

main();
