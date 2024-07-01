import { Components, Client as GraphServiceClient } from '../types/openapi-graph-service';
import { OpenAPIClientAxios, type Document } from 'openapi-client-axios';
import openapiJson from '../openapi-specs/graph-service.json' assert { type: 'json' };
import * as Config from '../config/config';
import logger from '../logger.js';

type GraphsQueryParamsDto = Components.Schemas.GraphsQueryParamsDto;
type UserGraphDto = Components.Schemas.UserGraphDto;
type ProviderGraphDto = Components.Schemas.ProviderGraphDto;

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
  public async postFollow(actorId: string, objectId: number): Promise<void> {
    logger.debug({ actorId, objectId }, 'Follow Request');
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
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
  }

  public async postUnfollow(actorId: string, objectId: number): Promise<void> {
    logger.debug({ actorId, objectId }, 'Unfollow Request');
    const providerGraphDto: ProviderGraphDto = {
      dsnpId: actorId,
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
  }
}
