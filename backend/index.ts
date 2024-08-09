// Config first
import 'dotenv/config';
// Augment Polkadot Types First
import '@frequency-chain/api-augment';
import express, { Request, Response, NextFunction } from 'express';
import pinoHttp, { Options } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import openapiJson from './openapi.json' assert { type: 'json' };
import { getApi } from './services/frequency.js';
import * as Config from './config/config.js';
import { AuthController } from './controllers/AuthController.js';
import { ContentController } from './controllers/ContentController.js';
import { GraphController } from './controllers/GraphController.js';
import { ProfilesController } from './controllers/ProfilesController.js';
import { AssestsController } from './controllers/AssetsController';
import { BroadcastsController } from './controllers/BroadcastsController';
import { MulterError } from 'multer';
import logger from './logger';
import { WebhookController } from './controllers/WebhookController';
import { ContentWatcherService } from './services/ContentWatcherService';
import { AnnouncementType } from './types/content-announcement';
import { randomUUID } from 'crypto';
import { ContentRepository } from './repositories/ContentRepository';
import { GraphService } from './services/GraphService';

// Support BigInt JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

Config.init(process.env);
ContentRepository.init();

const httpLogOptions: Options = {
  logger,
  autoLogging: false,
  serializers: {
    req: (req: Request) => ({
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      body: req.body,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
      status: res.status,
      data: res?.data,
    }),
  },
  customReceivedMessage: (req) => `RECV: ${req.method} ${req.url}`,
  customSuccessMessage: (req, res) => `RESP: ${req.method} ${req.url} ${res.statusCode}`,
};

const publicApp = express();
publicApp.use(express.json());
publicApp.use(cors());
publicApp.use(pinoHttp(httpLogOptions));

const privateApp = express();
privateApp.use(express.json());
privateApp.use(cors());
privateApp.use(pinoHttp(httpLogOptions));

const _controllers = [
  new AuthController(publicApp),
  new AssestsController(publicApp),
  new BroadcastsController(publicApp),
  new ContentController(publicApp),
  new GraphController(publicApp),
  new ProfilesController(publicApp),

  // private (backend) webhook controllers
  new WebhookController(privateApp),
];

async function waitForContentWatcherService(service: ContentWatcherService): Promise<void> {
  let isReady = false;
  while (!isReady) {
    isReady = await service.getScannerReadyStatus();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function waitForGraphService(service: GraphService): Promise<void> {
  let isReady = false;
  while (!isReady) {
    isReady = await service.getReadyStatus();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

ContentWatcherService.getInstance().then(async (service) => {
  // content-watcher-service may take a few seconds to start up
  // TODO: readyz should be implemented and wait for microservices to be ready
  await waitForContentWatcherService(service);

  service.registerWebhook(
    `${Config.instance().webhookBaseUrl}/content-watcher/announcements`,
    Object.values(AnnouncementType)
      .filter((v) => typeof v !== 'string')
      .map((v) => v as AnnouncementType)
  );

  service.requestContent({
    clientReferenceId: randomUUID(),
    blockCount: 14_400,
    webhookUrl: `${Config.instance().webhookBaseUrl}/content-watcher/announcements`,
  });
});

GraphService.getInstance().then(async (service) => {
  await waitForGraphService(service);

  service.registerWebhook(`${Config.instance().webhookBaseUrl}/graph-service/notifications`);
});

// Swagger UI
publicApp.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiJson));

publicApp.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error({ err });

  if (err instanceof MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err.message && err.message.includes('Multipart: Boundary not found')) {
    return res.status(400).json({ error: 'Invalid multipart/form-data header or boundary' });
  }

  return res.status(500).json({ error: 'An internal server error occurred.' });
});

const { port, webhookPort: privatePort, webhookHost: privateHost } = Config.instance();
if (process.env.NODE_ENV != 'test') {
  // start server
  publicApp.listen(port, () => {
    getApi().catch((e) => {
      logger.error('Error connecting to Frequency Node!!', e.message);
    });
    logger.info('api listening at http://localhost:%d', port);
    logger.info('OpenAPI Docs at http://localhost:%d/docs', port);
  });

  if (privateHost) {
    privateApp.listen(privatePort, privateHost, () =>
      logger.info('private api listening at http://%s:%d', privateHost, privatePort)
    );
  } else {
    privateApp.listen(privatePort, () => logger.info('private api listening at http://localhost:%d', privatePort));
  }
}

export { publicApp as app, privateApp };
