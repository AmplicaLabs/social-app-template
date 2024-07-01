import { Client as ContentWatcherClient, Components } from '../types/openapi-content-watcher-service';
import openapiJson from '../openapi-specs/content-watcher-service.json' with { type: 'json' };
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import * as Config from '../config/config';
import logger from '../logger';
import { AnnouncementType } from '../types/content-announcement';

type ResetScannerDto = Components.Schemas.ResetScannerDto;

export class ContentWatcherService {
  private static instance: ContentWatcherService;
  private _client: ContentWatcherClient;

  private constructor() {}

  public static async getInstance(): Promise<ContentWatcherService> {
    if (!ContentWatcherService.instance) {
      ContentWatcherService.instance = new ContentWatcherService();
      await ContentWatcherService.instance.connect();
    }
    return ContentWatcherService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: Config.instance().contentPublisherUrl,
      });

      this.client = await api.init<ContentWatcherClient>();
      this.client.defaults.baseURL = Config.instance().contentWatcherUrl;
    }
  }
  private set client(api: ContentWatcherClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error('API not initialized');
    }

    return this._client;
  }

  public async registerWebhook(url: string, announcementTypes: AnnouncementType[]) {
    try {
      let registeredWebhooks = await this.client.WebhookControllerV1_getRegisteredWebhooks();
      logger.debug(registeredWebhooks.data, 'Currently registered webhooks for content-watcher-service:');
      await this.client.WebhookControllerV1_registerWebhook(null, {
        url,
        announcementTypes: announcementTypes.map((prop) => AnnouncementType[prop].toLowerCase()),
      });
      registeredWebhooks = await this.client.WebhookControllerV1_getRegisteredWebhooks();
      logger.debug(registeredWebhooks.data, 'Updated registered webhooks for content-watcher-service:');
    } catch (err) {
      logger.error(err, 'Error registering content-watcher webhook');
    }
  }

  public async resetScanner(options: ResetScannerDto) {
    try {
      await this.client.ScanControllerV1_resetScanner(null, options);
    } catch (err) {
      logger.error(err, 'Error resetting content-watcher scan');
    }
  }
}
