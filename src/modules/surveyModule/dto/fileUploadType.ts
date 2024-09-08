import { FileUpload } from 'graphql-upload';

import { GraphQLScalarType } from 'graphql';

type FileOrNull = FileUpload | null;
const FileOrNullScalar = new GraphQLScalarType({
  name: 'FileOrString',
  description: 'Can be either an uploaded file or null',
  parseValue(value: any): FileOrNull {
    if (value === null) {
      return null;
    }
    if (value?.file) {
      return value?.file;
    }
    throw new Error('Invalid FileOrString value');
  },
});

export { FileOrNullScalar };
