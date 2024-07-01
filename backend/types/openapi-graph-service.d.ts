import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface ConnectionDto {
      /**
       * MSA ID representing the target of this connection
       * example:
       * 3
       */
      dsnpId: string;
      /**
       * Indicator connection type (public or private)
       * example:
       * public
       */
      privacyType: 'private' | 'public';
      /**
       * Indicator of the direction of this connection
       * example:
       * connectionTo
       */
      direction: 'connectionTo' | 'connectionFrom' | 'bidirectional' | 'disconnect';
      /**
       * Indicator of the type of connection (follow or friendship)
       * example:
       * follow
       */
      connectionType: 'follow' | 'friendship';
    }
    export interface ConnectionDtoWrapper {
      /**
       * Wrapper object for array of connections
       */
      data: ConnectionDto[];
    }
    export interface DsnpGraphEdge {
      /**
       * MSA ID of the user represented by this graph edge
       * example:
       * 3
       */
      userId: string;
      /**
       * Block number when connection represented by this graph edge was created
       * example:
       * 12
       */
      since: number;
    }
    export interface GraphChangeRepsonseDto {
      /**
       * Reference ID by which the results/status of a submitted GraphChangeRequest may be retrieved
       */
      referenceId: string;
    }
    export interface GraphKeyPairDto {
      /**
       * Public graph encryption key as a hex string (prefixed with "0x")
       */
      publicKey: string;
      /**
       * Private graph encryption key as a hex string (prefixed with "0x")
       */
      privateKey: string;
      /**
       * Key type of graph encryption keypair (currently only X25519 supported)
       * example:
       * X25519
       */
      keyType: 'X25519';
    }
    export interface GraphsQueryParamsDto {
      /**
       * Array of MSA IDs for which to query graphs
       * example:
       * [
       *   "2",
       *   "3",
       *   "4",
       *   "5"
       * ]
       */
      dsnpIds: string[];
      /**
       * Graph type to query (public or private)
       * example:
       * public
       */
      privacyType: 'private' | 'public';
      /**
       * Graph encryption keypairs for the users requested in `dsnpIds`. (Only for `privacyType` === "private"
       */
      graphKeyPairs?: GraphKeyPairDto[];
    }
    export interface ProviderGraphDto {
      /**
       * MSA ID that owns the connections represented in this object
       * example:
       * 2
       */
      dsnpId: string;
      /**
       * Array of connections known to the Provider for ths MSA referenced in this object
       */
      connections: {
        /**
         * Wrapper object for array of connections
         */
        data: ConnectionDto[];
      };
      /**
       * Optional array of graph encryption keypairs decrypting/encrypting the above-referenced users private graph
       */
      graphKeyPairs?: GraphKeyPairDto[];
    }
    export interface UserGraphDto {
      /**
       * MSA ID that is the owner of the graph represented by the graph edges in this object
       * example:
       * 2
       */
      dsnpId: string;
      /**
       * Optional array of graph edges in the specific user graph represented by this object
       */
      dsnpGraphEdges?: DsnpGraphEdge[];
    }
    export interface WatchGraphsDto {
      /**
       * MSA IDs for which to watch for graph updates
       * example:
       * [
       *   "2",
       *   "3",
       *   "4",
       *   "5"
       * ]
       */
      dsnpIds: string[];
      /**
       * Webhook URL to call when graph changes for the referenced MSAs are detected
       * example:
       * http://localhost/webhook
       */
      webhookEndpoint: string;
    }
  }
}
declare namespace Paths {
  namespace GraphControllerV1GetGraphs {
    export type RequestBody = Components.Schemas.GraphsQueryParamsDto;
    namespace Responses {
      export type $200 = Components.Schemas.UserGraphDto[];
    }
  }
  namespace GraphControllerV1UpdateGraph {
    export type RequestBody = Components.Schemas.ProviderGraphDto;
    namespace Responses {
      export type $201 = Components.Schemas.GraphChangeRepsonseDto;
    }
  }
  namespace HealthControllerHealthz {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HealthControllerLivez {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace HealthControllerReadyz {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1DeleteAllWebhooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1DeleteAllWebhooksForUrl {
    namespace Parameters {
      export type Url = string;
    }
    export interface QueryParameters {
      url: Parameters.Url;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1DeleteWebhooksForMsa {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1GetAllWebhooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1GetWebhooksForMsa {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1GetWebhooksForUrl {
    namespace Parameters {
      export type Url = string;
    }
    export interface QueryParameters {
      url: Parameters.Url;
    }
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhooksControllerV1WatchGraphs {
    export type RequestBody = Components.Schemas.WatchGraphsDto;
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
  /**
   * GraphControllerV1_getGraphs - Fetch graphs for specified dsnpIds and blockNumber
   */
  'GraphControllerV1_getGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.GraphControllerV1GetGraphs.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphControllerV1GetGraphs.Responses.$200>;
  /**
   * GraphControllerV1_updateGraph - Request an update to given users graph
   */
  'GraphControllerV1_updateGraph'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.GraphControllerV1UpdateGraph.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphControllerV1UpdateGraph.Responses.$201>;
  /**
   * WebhooksControllerV1_getAllWebhooks - Get all registered webhooks
   */
  'WebhooksControllerV1_getAllWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetAllWebhooks.Responses.$200>;
  /**
   * WebhooksControllerV1_watchGraphs - Watch graphs for specified dsnpIds and receive updates
   */
  'WebhooksControllerV1_watchGraphs'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.WebhooksControllerV1WatchGraphs.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1WatchGraphs.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteAllWebhooks - Delete all registered webhooks
   */
  'WebhooksControllerV1_deleteAllWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooks.Responses.$200>;
  /**
   * WebhooksControllerV1_getWebhooksForMsa - Get all registered webhooks for a specific MSA ID
   */
  'WebhooksControllerV1_getWebhooksForMsa'(
    parameters: Parameters<Paths.WebhooksControllerV1GetWebhooksForMsa.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForMsa.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteWebhooksForMsa - Delete all webhooks registered for a specific MSA
   */
  'WebhooksControllerV1_deleteWebhooksForMsa'(
    parameters: Parameters<Paths.WebhooksControllerV1DeleteWebhooksForMsa.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteWebhooksForMsa.Responses.$200>;
  /**
   * WebhooksControllerV1_getWebhooksForUrl - Get all webhooks registered to the specified URL
   */
  'WebhooksControllerV1_getWebhooksForUrl'(
    parameters?: Parameters<Paths.WebhooksControllerV1GetWebhooksForUrl.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForUrl.Responses.$200>;
  /**
   * WebhooksControllerV1_deleteAllWebhooksForUrl - Delete all MSA webhooks registered with the given URL
   */
  'WebhooksControllerV1_deleteAllWebhooksForUrl'(
    parameters?: Parameters<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.Responses.$200>;
  /**
   * HealthController_healthz - Check the health status of the service
   */
  'HealthController_healthz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>;
  /**
   * HealthController_livez - Check the live status of the service
   */
  'HealthController_livez'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>;
  /**
   * HealthController_readyz - Check the ready status of the service
   */
  'HealthController_readyz'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>;
}

export interface PathsDictionary {
  ['/v1/graphs/getGraphs']: {
    /**
     * GraphControllerV1_getGraphs - Fetch graphs for specified dsnpIds and blockNumber
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.GraphControllerV1GetGraphs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphControllerV1GetGraphs.Responses.$200>;
  };
  ['/v1/graphs']: {
    /**
     * GraphControllerV1_updateGraph - Request an update to given users graph
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.GraphControllerV1UpdateGraph.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphControllerV1UpdateGraph.Responses.$201>;
  };
  ['/v1/webhooks']: {
    /**
     * WebhooksControllerV1_getAllWebhooks - Get all registered webhooks
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetAllWebhooks.Responses.$200>;
    /**
     * WebhooksControllerV1_watchGraphs - Watch graphs for specified dsnpIds and receive updates
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.WebhooksControllerV1WatchGraphs.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1WatchGraphs.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteAllWebhooks - Delete all registered webhooks
     */
    'delete'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooks.Responses.$200>;
  };
  ['/v1/webhooks/users/{msaId}']: {
    /**
     * WebhooksControllerV1_getWebhooksForMsa - Get all registered webhooks for a specific MSA ID
     */
    'get'(
      parameters: Parameters<Paths.WebhooksControllerV1GetWebhooksForMsa.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForMsa.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteWebhooksForMsa - Delete all webhooks registered for a specific MSA
     */
    'delete'(
      parameters: Parameters<Paths.WebhooksControllerV1DeleteWebhooksForMsa.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteWebhooksForMsa.Responses.$200>;
  };
  ['/v1/webhooks/urls']: {
    /**
     * WebhooksControllerV1_getWebhooksForUrl - Get all webhooks registered to the specified URL
     */
    'get'(
      parameters?: Parameters<Paths.WebhooksControllerV1GetWebhooksForUrl.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1GetWebhooksForUrl.Responses.$200>;
    /**
     * WebhooksControllerV1_deleteAllWebhooksForUrl - Delete all MSA webhooks registered with the given URL
     */
    'delete'(
      parameters?: Parameters<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhooksControllerV1DeleteAllWebhooksForUrl.Responses.$200>;
  };
  ['/healthz']: {
    /**
     * HealthController_healthz - Check the health status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerHealthz.Responses.$200>;
  };
  ['/livez']: {
    /**
     * HealthController_livez - Check the live status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerLivez.Responses.$200>;
  };
  ['/readyz']: {
    /**
     * HealthController_readyz - Check the ready status of the service
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.HealthControllerReadyz.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
