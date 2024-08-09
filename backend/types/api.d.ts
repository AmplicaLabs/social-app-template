import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
  namespace Responses {
    export interface UnauthorizedError {}
  }
  namespace Schemas {
    export interface AuthAccountResponse {
      accessToken: string;
      expires: number;
      referenceId?: string;
      msaId: string;
      handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
      };
    }
    export interface Broadcast {
      fromId: string;
      /**
       * JSON-encoded Activity Content Note
       */
      content: string;
      /**
       * Timestamp of the post
       */
      timestamp: string;
      /**
       * Array of ReplyExtended objects
       */
      replies?: ReplyExtended[];
    }
    export interface BroadcastExtended {
      fromId: string;
      contentHash: string;
      /**
       * JSON-encoded Activity Content Note
       */
      content: string;
      /**
       * Timestamp of the post
       */
      timestamp: string;
      /**
       * Array of ReplyExtended objects
       */
      replies?: ReplyExtended[];
    }
    export interface CreateIdentityRequest {
      addProviderSignature: string;
      algo: 'SR25519';
      baseHandle: string;
      encoding: 'hex';
      expiration: number;
      handleSignature: string;
      publicKey: string;
    }
    export interface CreateIdentityResponse {
      accessToken: string;
      expires: number;
    }
    export interface CreatePostRequest {
      content: string;
      inReplyTo?: string;
      images?: string /* binary */[];
    }
    export interface DelegateRequest {
      algo: 'SR25519';
      encoding: 'hex';
      encodedValue: string;
      publicKey: string;
    }
    export interface DelegateResponse {
      accessToken: string;
      expires: number;
    }
    export interface EditPostRequest {
      targetContentHash: string;
      targetAnnouncementType: number;
      content: string;
    }
    export interface EditProfileRequest {
      content: string;
    }
    export interface HandlesResponse {
      publicKey: string;
      handle: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
      };
    }
    export interface LoginRequest {
      algo: 'SR25519';
      encoding: 'hex';
      encodedValue: string;
      publicKey: string;
    }
    export interface LoginResponse {
      accessToken: string;
      expires: number;
      msaId: string;
    }
    export interface PaginatedBroadcast {
      newestBlockNumber: number;
      oldestBlockNumber: number;
      posts: BroadcastExtended[];
    }
    export interface PostBroadcastRequest {
      content: string;
      inReplyTo?: string;
      assets?: string[];
    }
    export interface PostBroadcastResponse {
      /**
       * JSON-encoded Activity Content Note
       */
      content: string;
      /**
       * Timestamp of the post
       */
      published: string;
    }
    export interface Profile {
      fromId: string;
      contentHash: string;
      /**
       * JSON-encoded Activity Content Note
       */
      content: string;
      /**
       * Timestamp of the post
       */
      timestamp: string;
      handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
      };
    }
    export interface ProviderResponse {
      nodeUrl: string;
      siwfUrl: string;
      /**
       * IPFS Path Style Gateway base URI
       */
      ipfsGateway?: string;
      providerId: string;
      schemas: number[];
      network: 'local' | 'testnet' | 'mainnet';
    }
    export interface ReplyExtended {
      fromId: string;
      contentHash: string;
      /**
       * JSON-encoded Activity Content Note
       */
      content: string;
      /**
       * Timestamp of the post
       */
      timestamp: string;
      /**
       * Array of ReplyExtended objects
       */
      replies?: ReplyExtended[];
    }
    /**
     * Schema defining the request payload for uploading assets. Requires a list of files to upload.
     */
    export interface UploadAssetRequest {
      /**
       * Array of files to be uploaded. Each file must be encoded in binary format.
       */
      files: [string, ...string[]];
    }
    /**
     * Schema defining the response for a successful asset upload operation. Contains identifiers for all uploaded assets.
     */
    export interface UploadAssetResponse {
      /**
       * Array of unique identifiers assigned to the uploaded assets.
       */
      assetIds: string[];
    }
    export interface WalletLoginRequest {
      signIn?: {
        siwsPayload?: {
          message: string;
          signature: string;
        };
        error?: {
          message: string;
        };
      };
      signUp?: {
        extrinsics?: {
          pallet: string;
          extrinsicName: string;
          encodedExtrinsic: string;
        }[];
        error?: {
          message: string;
        };
      };
    }
    export interface WalletLoginResponse {
      referenceId: string;
      msaId?: string;
      handle?: {
        base_handle: string;
        canonical_base: string;
        suffix: number;
      };
    }
  }
}
declare namespace Paths {
  namespace AuthAccount {
    namespace Parameters {
      export type MsaId = string;
      export type ReferenceId = string;
    }
    export interface QueryParameters {
      msaId?: Parameters.MsaId;
      referenceId?: Parameters.ReferenceId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.AuthAccountResponse;
      export interface $202 {}
    }
  }
  namespace AuthLogin {
    export type RequestBody = Components.Schemas.WalletLoginRequest;
    namespace Responses {
      export type $200 = Components.Schemas.WalletLoginResponse;
      export interface $202 {}
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace AuthLogout {
    namespace Responses {
      export interface $201 {}
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace AuthProvider {
    namespace Responses {
      export type $200 = Components.Schemas.ProviderResponse;
    }
  }
  namespace CreateBroadcast {
    export type RequestBody = Components.Schemas.CreatePostRequest;
    namespace Responses {
      export type $200 = Components.Schemas.BroadcastExtended;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace CreateProfile {
    namespace Parameters {
      export type DsnpId = string;
    }
    export interface PathParameters {
      dsnpId: Parameters.DsnpId;
    }
    export type RequestBody = Components.Schemas.EditProfileRequest;
    namespace Responses {
      export type $200 = Components.Schemas.Profile;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace EditContent {
    namespace Parameters {
      export type ContentHash = string;
      export type Type = string;
    }
    export interface PathParameters {
      contentHash: Parameters.ContentHash;
      type: Parameters.Type;
    }
    export type RequestBody = Components.Schemas.EditPostRequest;
    namespace Responses {
      export type $200 = Components.Schemas.BroadcastExtended;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GetContent {
    namespace Parameters {
      export type ContentHash = string;
      export type DsnpId = string;
    }
    export interface PathParameters {
      dsnpId: Parameters.DsnpId;
      contentHash: Parameters.ContentHash;
    }
    namespace Responses {
      export type $200 = Components.Schemas.BroadcastExtended;
      export type $401 = Components.Responses.UnauthorizedError;
      export interface $404 {}
    }
  }
  namespace GetDiscover {
    namespace Parameters {
      export type NewestBlockNumber = number;
      export type OldestBlockNumber = number;
    }
    export interface QueryParameters {
      newestBlockNumber?: Parameters.NewestBlockNumber;
      oldestBlockNumber?: Parameters.OldestBlockNumber;
    }
    namespace Responses {
      export type $200 = Components.Schemas.PaginatedBroadcast;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GetFeed {
    namespace Parameters {
      export type NewestBlockNumber = number;
      export type OldestBlockNumber = number;
    }
    export interface QueryParameters {
      newestBlockNumber?: Parameters.NewestBlockNumber;
      oldestBlockNumber?: Parameters.OldestBlockNumber;
    }
    namespace Responses {
      export type $200 = Components.Schemas.PaginatedBroadcast;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GetProfile {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = Components.Schemas.Profile;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GetUserFeed {
    namespace Parameters {
      export type DsnpId = string;
      export type NewestBlockNumber = number;
      export type OldestBlockNumber = number;
    }
    export interface PathParameters {
      dsnpId: Parameters.DsnpId;
    }
    export interface QueryParameters {
      newestBlockNumber?: Parameters.NewestBlockNumber;
      oldestBlockNumber?: Parameters.OldestBlockNumber;
    }
    namespace Responses {
      export type $200 = Components.Schemas.PaginatedBroadcast;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GraphFollow {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $201 {
        /**
         * ReferenceId from the request
         */
        referenceId?: string;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace GraphOperationStatus {
    namespace Parameters {
      export type ReferenceId = string;
    }
    export interface PathParameters {
      referenceId: Parameters.ReferenceId;
    }
    namespace Responses {
      export interface $200 {
        /**
         * ReferenceId from the request
         */
        referenceId: string;
        /**
         * status
         */
        status: 'pending' | 'expired' | 'failed' | 'succeeded';
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export interface $404 {}
    }
  }
  namespace GraphUnfollow {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export interface $201 {
        /**
         * ReferenceId from the request
         */
        referenceId?: string;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace PostAssetsHandler {
    export type RequestBody =
      /* Schema defining the request payload for uploading assets. Requires a list of files to upload. */ Components.Schemas.UploadAssetRequest;
    namespace Responses {
      export type $202 =
        /* Schema defining the response for a successful asset upload operation. Contains identifiers for all uploaded assets. */ Components.Schemas.UploadAssetResponse;
      export interface $400 {}
      export interface $401 {}
      export interface $500 {}
      export interface $503 {}
    }
  }
  namespace PostBroadcastHandler {
    export type RequestBody = Components.Schemas.PostBroadcastRequest;
    namespace Responses {
      export type $202 = Components.Schemas.PostBroadcastResponse;
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  namespace UserFollowing {
    namespace Parameters {
      export type MsaId = string;
    }
    export interface PathParameters {
      msaId: Parameters.MsaId;
    }
    namespace Responses {
      export type $200 = string[];
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
}

export interface OperationMethods {
  /**
   * postAssetsHandler - Upload and register new assets
   *
   * Allows clients to upload new assets. This endpoint accepts multipart file uploads and returns the identifiers for the newly uploaded assets.
   */
  'postAssetsHandler'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostAssetsHandler.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.PostAssetsHandler.Responses.$202>;
  /**
   * postBroadcastHandler - Create a new post
   */
  'postBroadcastHandler'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostBroadcastHandler.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.PostBroadcastHandler.Responses.$202>;
  /**
   * authProvider - Return the delegation and provider information
   */
  'authProvider'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AuthProvider.Responses.$200>;
  /**
   * authLogin - Use Sign In With Frequency to login
   */
  'authLogin'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AuthLogin.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AuthLogin.Responses.$200 | Paths.AuthLogin.Responses.$202>;
  /**
   * authLogout - Logout and invalidate the access token
   */
  'authLogout'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AuthLogout.Responses.$201>;
  /**
   * authAccount - For polling to get the created account as authCreate can take time
   */
  'authAccount'(
    parameters?: Parameters<Paths.AuthAccount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AuthAccount.Responses.$200 | Paths.AuthAccount.Responses.$202>;
  /**
   * getUserFeed - Get recent posts from a user, paginated
   */
  'getUserFeed'(
    parameters: Parameters<Paths.GetUserFeed.QueryParameters & Paths.GetUserFeed.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetUserFeed.Responses.$200>;
  /**
   * getFeed - Get the Feed for the current user, paginated
   */
  'getFeed'(
    parameters?: Parameters<Paths.GetFeed.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFeed.Responses.$200>;
  /**
   * getDiscover - Get the Discovery Feed, paginated
   */
  'getDiscover'(
    parameters?: Parameters<Paths.GetDiscover.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDiscover.Responses.$200>;
  /**
   * createBroadcast - Create a new post
   */
  'createBroadcast'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateBroadcast.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateBroadcast.Responses.$200>;
  /**
   * getContent - Get details of a specific post
   */
  'getContent'(
    parameters: Parameters<Paths.GetContent.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetContent.Responses.$200>;
  /**
   * editContent - Edit the content of a specific post
   */
  'editContent'(
    parameters: Parameters<Paths.EditContent.PathParameters>,
    data?: Paths.EditContent.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.EditContent.Responses.$200>;
  /**
   * userFollowing - Get a list of users that a specific user follows
   */
  'userFollowing'(
    parameters: Parameters<Paths.UserFollowing.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserFollowing.Responses.$200>;
  /**
   * graphOperationStatus - Get the status of a previously submitted graph operation by its referenceId
   */
  'graphOperationStatus'(
    parameters: Parameters<Paths.GraphOperationStatus.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphOperationStatus.Responses.$200>;
  /**
   * graphFollow - Follow a user
   */
  'graphFollow'(
    parameters: Parameters<Paths.GraphFollow.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphFollow.Responses.$201>;
  /**
   * graphUnfollow - Unfollow a user
   */
  'graphUnfollow'(
    parameters: Parameters<Paths.GraphUnfollow.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GraphUnfollow.Responses.$201>;
  /**
   * getProfile - Get profile information for a specific user
   */
  'getProfile'(
    parameters: Parameters<Paths.GetProfile.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetProfile.Responses.$200>;
  /**
   * createProfile - Create/Edit the profile information for a current user
   */
  'createProfile'(
    parameters: Parameters<Paths.CreateProfile.PathParameters>,
    data?: Paths.CreateProfile.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateProfile.Responses.$200>;
}

export interface PathsDictionary {
  ['/assets']: {
    /**
     * postAssetsHandler - Upload and register new assets
     *
     * Allows clients to upload new assets. This endpoint accepts multipart file uploads and returns the identifiers for the newly uploaded assets.
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostAssetsHandler.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PostAssetsHandler.Responses.$202>;
  };
  ['/broadcasts']: {
    /**
     * postBroadcastHandler - Create a new post
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostBroadcastHandler.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.PostBroadcastHandler.Responses.$202>;
  };
  ['/auth/siwf']: {
    /**
     * authProvider - Return the delegation and provider information
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AuthProvider.Responses.$200>;
  };
  ['/auth/login']: {
    /**
     * authLogin - Use Sign In With Frequency to login
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AuthLogin.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AuthLogin.Responses.$200 | Paths.AuthLogin.Responses.$202>;
  };
  ['/auth/logout']: {
    /**
     * authLogout - Logout and invalidate the access token
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AuthLogout.Responses.$201>;
  };
  ['/auth/account']: {
    /**
     * authAccount - For polling to get the created account as authCreate can take time
     */
    'get'(
      parameters?: Parameters<Paths.AuthAccount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AuthAccount.Responses.$200 | Paths.AuthAccount.Responses.$202>;
  };
  ['/content/{dsnpId}']: {
    /**
     * getUserFeed - Get recent posts from a user, paginated
     */
    'get'(
      parameters: Parameters<Paths.GetUserFeed.QueryParameters & Paths.GetUserFeed.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetUserFeed.Responses.$200>;
  };
  ['/content/feed']: {
    /**
     * getFeed - Get the Feed for the current user, paginated
     */
    'get'(
      parameters?: Parameters<Paths.GetFeed.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFeed.Responses.$200>;
  };
  ['/content/discover']: {
    /**
     * getDiscover - Get the Discovery Feed, paginated
     */
    'get'(
      parameters?: Parameters<Paths.GetDiscover.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDiscover.Responses.$200>;
  };
  ['/content/create']: {
    /**
     * createBroadcast - Create a new post
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateBroadcast.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateBroadcast.Responses.$200>;
  };
  ['/content/{dsnpId}/{contentHash}']: {
    /**
     * getContent - Get details of a specific post
     */
    'get'(
      parameters: Parameters<Paths.GetContent.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetContent.Responses.$200>;
  };
  ['/content/{type}/{contentHash}']: {
    /**
     * editContent - Edit the content of a specific post
     */
    'put'(
      parameters: Parameters<Paths.EditContent.PathParameters>,
      data?: Paths.EditContent.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.EditContent.Responses.$200>;
  };
  ['/graph/{msaId}/following']: {
    /**
     * userFollowing - Get a list of users that a specific user follows
     */
    'get'(
      parameters: Parameters<Paths.UserFollowing.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserFollowing.Responses.$200>;
  };
  ['/graph/operations/{referenceId}']: {
    /**
     * graphOperationStatus - Get the status of a previously submitted graph operation by its referenceId
     */
    'get'(
      parameters: Parameters<Paths.GraphOperationStatus.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphOperationStatus.Responses.$200>;
  };
  ['/graph/{msaId}/follow']: {
    /**
     * graphFollow - Follow a user
     */
    'post'(
      parameters: Parameters<Paths.GraphFollow.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphFollow.Responses.$201>;
  };
  ['/graph/{msaId}/unfollow']: {
    /**
     * graphUnfollow - Unfollow a user
     */
    'post'(
      parameters: Parameters<Paths.GraphUnfollow.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GraphUnfollow.Responses.$201>;
  };
  ['/profiles/{msaId}']: {
    /**
     * getProfile - Get profile information for a specific user
     */
    'get'(
      parameters: Parameters<Paths.GetProfile.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetProfile.Responses.$200>;
    /**
     * createProfile - Create/Edit the profile information for a current user
     */
    'put'(
      parameters: Parameters<Paths.CreateProfile.PathParameters>,
      data?: Paths.CreateProfile.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateProfile.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
