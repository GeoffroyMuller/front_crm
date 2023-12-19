// Original file: media.proto


export interface Media {
  'id'?: (number);
  'idCompany'?: (number);
  'filepath'?: (string);
  'filename'?: (string);
  'idModel'?: (number);
  'model'?: (string);
}

export interface Media__Output {
  'id': (number);
  'idCompany': (number);
  'filepath': (string);
  'filename': (string);
  'idModel': (number);
  'model': (string);
}
ctor>): Subtype;
};

export interface ProtoGrpcType {
  FindRequest: MessageTypeDefinition
  FindResponse: MessageTypeDefinition
  Media: MessageTypeDefinition
  MediaService: SubtypeConstructor<typeof grpc.Client, _MediaServiceClient> & { service: _MediaServiceDefinition }
  User: MessageTypeDefinition
}

