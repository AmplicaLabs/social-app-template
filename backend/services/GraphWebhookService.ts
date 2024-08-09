import { Client as GraphServiceWebhookClient } from '../types/openapi-graph-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/account-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import { HttpStatusCode } from 'axios';
import logger from '../logger';
import { HttpError } from '../types/HttpError';
import { GraphChangeNotificationV1, GraphOperationStatusV1 } from '../types/graph-service-webhook';

export class GraphWebhookService {
  private static instance: GraphWebhookService;
  private static _referenceIdsPending = new Map<string, string>();
  private _client: GraphServiceWebhookClient;

  private constructor() {}

  public static updateOperationByRefId(refId: string, status: 'pending' | 'expired' | 'failed' | 'succeeded') {
    logger.debug({ refId, status }, 'Setting graph operation status');
    GraphWebhookService._referenceIdsPending.set(refId, status);
  }

  public static getOperationStatusByRefId(refId: string): string | undefined {
    return GraphWebhookService._referenceIdsPending.get(refId);
  }

  public static async getInstance(): Promise<GraphWebhookService> {
    if (!GraphWebhookService.instance) {
      GraphWebhookService.instance = new GraphWebhookService();
      await GraphWebhookService.instance.connect();
    }
    return GraphWebhookService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as Document,
        withServer: { url: Config.instance().accountServiceUrl },
      });
      this.client = await api.init<GraphServiceWebhookClient>();
    }
  }

  private set client(api: GraphServiceWebhookClient) {
    this._client = api;
  }

  private get client() {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  public processGraphUpdateNotification(update: GraphChangeNotificationV1) {
    logger.debug(update, 'Received graph update notification');
    return HttpStatusCode.Ok;
  }

  /**
   * Handles the webhook from the graph service.
   * @param _req - The request object, contains the on-chain data from the graph-service for the referenceId.
   * @param res - The response object.
   */
  public requestRefIdWebhook({ referenceId, status }: GraphOperationStatusV1) {
    if (referenceId && status) {
      GraphWebhookService.updateOperationByRefId(referenceId, status);
      logger.debug(`GraphWebhookService:requestRefIdWebhook: received referenceId: ${referenceId}`);
    } else {
      throw new HttpError(HttpStatusCode.BadRequest, 'Missing required fields');
    }
    return HttpStatusCode.Ok;
  }
}
