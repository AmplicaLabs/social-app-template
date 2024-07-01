import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Schemas {
    export interface ChainWatchOptionsDto {
      /**
       * Specific schema ids to watch for
       * example:
       * [
       *   1,
       *   19
       * ]
       */
      schemaIds: number[];
      /**
       * Specific dsnpIds (msa_id) to watch for
       * example:
       * [
       *   "10074",
       *   "100001"
       * ]
       */
      dsnpIds: string[];
    }
    export interface ContentSearchRequestDto {
      /**
       * The starting block number to search from
       * example:
       * 100
       */
      startBlock: number;
      /**
       * The ending block number to search to
       * example:
       * 101
       */
      endBlock: number;
      /**
       * The schemaIds/dsnpIds to filter by
       */
      filters: {
        /**
         * Specific schema ids to watch for
         * example:
         * [
         *   1,
         *   19
         * ]
         */
        schemaIds: number[];
        /**
         * Specific dsnpIds (msa_id) to watch for
         * example:
         * [
         *   "10074",
         *   "100001"
         * ]
         */
        dsnpIds: string[];
      };
      id: string;
    }
    export interface ResetScannerDto {
      /**
       * The block number to reset the scanner to
       * example:
       * 0
       */
      blockNumber?: number;
      /**
       * Number of blocks to rewind the scanner to (from `blockNumber` if supplied; else from latest block
       * example:
       * 100
       */
      rewindOffset?: number;
      /**
       * Whether to schedule the new scan immediately or wait for the next scheduled interval
       * example:
       * true
       */
      immediate?: boolean;
    }
    export interface WebhookRegistrationDto {
      /**
       * Webhook URL
       * example:
       * https://example.com/webhook
       */
      url: string;
      /**
       * Announcement types to send to the webhook
       * example:
       * [
       *   "Broadcast",
       *   "Reaction",
       *   "Tombstone",
       *   "Reply",
       *   "Update"
       * ]
       */
      announcementTypes: string[];
    }
  }
}
declare namespace Paths {
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
  namespace ScanControllerV1GetWatchOptions {
    namespace Responses {
      export type $200 = Components.Schemas.ChainWatchOptionsDto;
    }
  }
  namespace ScanControllerV1PauseScanner {
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ScanControllerV1ResetScanner {
    export type RequestBody = Components.Schemas.ResetScannerDto;
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ScanControllerV1SetWatchOptions {
    export type RequestBody = Components.Schemas.ChainWatchOptionsDto;
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace ScanControllerV1StartScanner {
    namespace Parameters {
      export type Immediate = boolean;
    }
    export interface QueryParameters {
      immediate?: Parameters.Immediate;
    }
    namespace Responses {
      export interface $201 {}
    }
  }
  namespace SearchControllerV1Search {
    export type RequestBody = Components.Schemas.ContentSearchRequestDto;
    namespace Responses {
      export type $200 = string;
    }
  }
  namespace WebhookControllerV1ClearAllWebHooks {
    namespace Responses {
      export interface $200 {}
    }
  }
  namespace WebhookControllerV1GetRegisteredWebhooks {
    namespace Responses {
      export type $200 = Components.Schemas.WebhookRegistrationDto[];
    }
  }
  namespace WebhookControllerV1RegisterWebhook {
    export type RequestBody = Components.Schemas.WebhookRegistrationDto;
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
  /**
   * ScanControllerV1_resetScanner - Reset blockchain scan to a specific block number or offset from the current position
   */
  'ScanControllerV1_resetScanner'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ScanControllerV1ResetScanner.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ScanControllerV1ResetScanner.Responses.$201>;
  /**
   * ScanControllerV1_getWatchOptions - Get the current watch options for the blockchain content event scanner
   */
  'ScanControllerV1_getWatchOptions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ScanControllerV1GetWatchOptions.Responses.$200>;
  /**
   * ScanControllerV1_setWatchOptions - Set watch options to filter the blockchain content scanner by schemas or MSA IDs
   */
  'ScanControllerV1_setWatchOptions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.ScanControllerV1SetWatchOptions.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ScanControllerV1SetWatchOptions.Responses.$201>;
  /**
   * ScanControllerV1_pauseScanner - Pause the blockchain scanner
   */
  'ScanControllerV1_pauseScanner'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ScanControllerV1PauseScanner.Responses.$201>;
  /**
   * ScanControllerV1_startScanner - Resume the blockchain content event scanner
   */
  'ScanControllerV1_startScanner'(
    parameters?: Parameters<Paths.ScanControllerV1StartScanner.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ScanControllerV1StartScanner.Responses.$201>;
  /**
   * SearchControllerV1_search - Search for DSNP content by id, start/end block, and filters
   */
  'SearchControllerV1_search'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.SearchControllerV1Search.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.SearchControllerV1Search.Responses.$200>;
  /**
   * WebhookControllerV1_getRegisteredWebhooks - Get the list of currently registered webhooks
   */
  'WebhookControllerV1_getRegisteredWebhooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhookControllerV1GetRegisteredWebhooks.Responses.$200>;
  /**
   * WebhookControllerV1_registerWebhook - Register a webhook to be called when new content is encountered on the chain
   */
  'WebhookControllerV1_registerWebhook'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.WebhookControllerV1RegisterWebhook.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhookControllerV1RegisterWebhook.Responses.$200>;
  /**
   * WebhookControllerV1_clearAllWebHooks - Clear all previously registered webhooks
   */
  'WebhookControllerV1_clearAllWebHooks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.WebhookControllerV1ClearAllWebHooks.Responses.$200>;
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
  ['/v1/scanner/reset']: {
    /**
     * ScanControllerV1_resetScanner - Reset blockchain scan to a specific block number or offset from the current position
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ScanControllerV1ResetScanner.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ScanControllerV1ResetScanner.Responses.$201>;
  };
  ['/v1/scanner/options']: {
    /**
     * ScanControllerV1_getWatchOptions - Get the current watch options for the blockchain content event scanner
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ScanControllerV1GetWatchOptions.Responses.$200>;
    /**
     * ScanControllerV1_setWatchOptions - Set watch options to filter the blockchain content scanner by schemas or MSA IDs
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.ScanControllerV1SetWatchOptions.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ScanControllerV1SetWatchOptions.Responses.$201>;
  };
  ['/v1/scanner/pause']: {
    /**
     * ScanControllerV1_pauseScanner - Pause the blockchain scanner
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ScanControllerV1PauseScanner.Responses.$201>;
  };
  ['/v1/scanner/start']: {
    /**
     * ScanControllerV1_startScanner - Resume the blockchain content event scanner
     */
    'post'(
      parameters?: Parameters<Paths.ScanControllerV1StartScanner.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ScanControllerV1StartScanner.Responses.$201>;
  };
  ['/v1/search']: {
    /**
     * SearchControllerV1_search - Search for DSNP content by id, start/end block, and filters
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.SearchControllerV1Search.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.SearchControllerV1Search.Responses.$200>;
  };
  ['/v1/webhooks']: {
    /**
     * WebhookControllerV1_registerWebhook - Register a webhook to be called when new content is encountered on the chain
     */
    'put'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.WebhookControllerV1RegisterWebhook.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhookControllerV1RegisterWebhook.Responses.$200>;
    /**
     * WebhookControllerV1_clearAllWebHooks - Clear all previously registered webhooks
     */
    'delete'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhookControllerV1ClearAllWebHooks.Responses.$200>;
    /**
     * WebhookControllerV1_getRegisteredWebhooks - Get the list of currently registered webhooks
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.WebhookControllerV1GetRegisteredWebhooks.Responses.$200>;
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
