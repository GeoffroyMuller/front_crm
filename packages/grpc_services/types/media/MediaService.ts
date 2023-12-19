// Original file: media.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FindRequest as _FindRequest, FindRequest__Output as _FindRequest__Output } from './FindRequest';
import type { FindResponse as _FindResponse, FindResponse__Output as _FindResponse__Output } from './FindResponse';

export interface MediaServiceClient extends grpc.Client {
  Find(argument: _FindRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  Find(argument: _FindRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  Find(argument: _FindRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  Find(argument: _FindRequest, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  find(argument: _FindRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  find(argument: _FindRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  find(argument: _FindRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  find(argument: _FindRequest, callback: grpc.requestCallback<_FindResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface MediaServiceHandlers extends grpc.UntypedServiceImplementation {
  Find: grpc.handleUnaryCall<_FindRequest__Output, _FindResponse>;
  
}

export interface MediaServiceDefinition extends grpc.ServiceDefinition {
  Find: MethodDefinition<_FindRequest, _FindResponse, _FindRequest__Output, _FindResponse__Output>
}
