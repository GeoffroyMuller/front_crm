// Original file: media.proto

import type { User as _User, User__Output as _User__Output } from './User';

export interface FindRequest {
  'model'?: (string);
  'modelId'?: (number);
  'auth'?: (_User | null);
  '_modelId'?: "modelId";
}

export interface FindRequest__Output {
  'model': (string);
  'modelId'?: (number);
  'auth': (_User__Output | null);
  '_modelId': "modelId";
}
