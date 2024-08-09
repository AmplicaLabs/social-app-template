import { Components, Client as GraphServiceClient } from '../types/openapi-graph-service';
import { GraphWebhookService } from './GraphWebhookService';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/graph-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import logger from '../logger.js';

type GraphsQueryParamsDto = Components.Schemas.GraphsQueryParamsDto;
type UserGraphDto = Components.Schemas.UserGraphDto;
type ProviderGraphDto = Components.Schemas.ProviderGraphDto;
type WatchGraphsDto = Components.Schemas.WatchGraphsDto;

export class GraphService {
  private static instance: GraphService;
  private _client: GraphServiceClient;

  private constructor() {}

  public static async getInstance(): Promise<GraphService> {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService();
      await GraphService.instance.connect();
    }
    return GraphService.instance;
  }

  private async connect() {
    if (this._client === undefined) {
      const api = new OpenAPIClientAxios({
        definition: openapiJson as unknown as Document,
        withServer: { url: Config.instance().graphServiceUrl },
      });
      this._client = await api.init<GraphServiceClient>();
    }
  }

  private set client(api: GraphServiceClient) {
    this._client = api;
  }

  private get client(): GraphServiceClient {
    if (this._client === undefined) {
      throw new Error(`${this.constructor.name} API not initialized`);
    }
    return this._client;
  }

  public async registerWebhook(webhookEndpoint: string, msaIds?: string[]): Promise<void> {
    try {
      const dto: WatchGraphsDto = {
        webhookEndpoint,
      };

      if (msaIds && msaIds.length > 0) {
        dto.dsnpIds = msaIds;
      }

      await this.client.WebhooksControllerV1_watchGraphs(null, dto);
      const webhooks = await this.client.WebhooksControllerV1_getWebhooksForUrl({ url: webhookEndpoint });
      logger.debug({ webhookEndpoint, watchedGraphs: webhooks.data }, 'Updated registered webhooks for graph-service:');
    } catch (err: any) {
      logger.error(`Error registering graph-service webhooks`, err, err?.stack);
    }
  }

  /**
   * Retrieves the list of public follows for a given MSA ID.
   * @param msaId - The MSA ID for which to retrieve the public follows.
   * @returns A promise that resolves to an array of strings representing the user IDs of the public follows.
   */
  public async getPublicFollows(msaId: string): Promise<string[]> {
    const graphsQueryParamsDto: GraphsQueryParamsDto = {
      dsnpIds: [msaId],
      privacyType: 'public',
      graphKeyPairs: [],
    };
    logger.debug({ msaId, graphsQueryParamsDto }, 'GraphService: getPublicFollows: data from API call');
    const resp = await this.client.GraphControllerV1_getGraphs(null, graphsQueryParamsDto);
    const userGraphDto: UserGraphDto[] = resp.data;
    const followList: string[] = userGraphDto
      .map((userGraph) => userGraph.dsnpGraphEdges?.map((edge) => edge.userId.toString()))
      .filter((item): item is string[] => item !== undefined)
      .flat();
    logger.debug({ followList }, 'GraphService: getPublicFollows: processed followList');
    return followList;
  }

  /**
   * Posts a follow request from an actor to an object.
   *
   * @param actorId - The ID of the actor.
   * @param objectId - The ID of the object.
   * @returns A Promise that resolves to void.
   */
  public async postFollow(actorId: string, objectId: number): Promise<string> {
    logger.debug({ actorId, objectId }, 'Follow Request');
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
      webhookUrl: `${Config.instance().webhookBaseUrl}/graph-service/operation-status`,
      connections: {
        data: [
          {
            dsnpId: objectId.toString(),
            privacyType: 'public',
            direction: 'connectionTo',
            connectionType: 'follow',
          },
        ],
      },
    };
    const resp = await this.client.GraphControllerV1_updateGraph(null, providerGraphDto);
    // Here we get the reference Id from the BullMQ worker queue
    // We can setup a webhook to listen for the response when the block with this txn is finalized
    // REMOVE: For now we will just assume that the transaction is successful in about 14 seconds
    logger.debug({ response: resp.data }, 'REMOVE: DEBUG: Follow Response');
    GraphWebhookService.updateOperationByRefId(resp.data.referenceId, 'pending');
    return resp.data.referenceId;
  }

  public async postUnfollow(actorId: string, objectId: number): Promise<string> {
    logger.debug({ actorId, objectId }, 'Unfollow Request');
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
      webhookUrl: `${Config.instance().webhookBaseUrl}/graph-service/operation-status`,
      connections: {
        data: [
          {
            dsnpId: objectId.toString(),
            privacyType: 'public',
            direction: 'disconnect',
            connectionType: 'follow',
          },
        ],
      },
    };
    const resp = await this.client.GraphControllerV1_updateGraph(null, providerGraphDto);
    // Here we get the reference Id from the BullMQ worker queue
    // We can setup a webhook to listen for the response when the block with this txn is finalized
    // REMOVE: For now we will just assume that the transaction is successful in about 14 seconds
    logger.debug({ response: resp.data }, 'REMOVE: DEBUG: Unfollow Response');
    GraphWebhookService.updateOperationByRefId(resp.data.referenceId, 'pending');
    return resp.data.referenceId;
  }

  /**
   * Retrieves the scanner ready status of the graph-service.
   * @returns A Promise that resolves to a boolean indicating whether the service is ready or not.
   */
  public async getReadyStatus(): Promise<boolean> {
    try {
      const response = await this.client.HealthController_readyz(null);
      if (response.status === 200) {
        logger.debug('graph-service is ready');
      }
      return true;
    } catch (err) {
      logger.error(err, 'Error getting graph-service ready status');
      return false;
    }
  }
}
