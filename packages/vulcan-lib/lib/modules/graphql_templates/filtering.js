import { convertToGraphQL } from './types.js';

// field types that support filtering
const supportedFieldTypes = ['String', 'Int', 'Date'];

/* ------------------------------------- Selector Types ------------------------------------- */

/*

The selector type is used to query for one or more documents

type MovieSelectorInput {
  AND: [MovieSelectorInput]
  OR: [MovieSelectorInput]
  id: String
  id_not: String
  id_in: [String!]
  id_not_in: [String!]
  ...
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  ...
}

see https://www.opencrud.org/#sec-Data-types

*/
export const selectorInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}SelectorInput {
  _and: [${typeName}SelectorInput]
  _or: [${typeName}SelectorInput]
${convertToGraphQL(fields, '  ')}
}`;

/*

The unique selector type is used to query for exactly one document

type MovieSelectorUniqueInput {
  _id: String
  slug: String
}

*/
export const selectorUniqueInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}SelectorUniqueInput {
  _id: String
  documentId: String # OpenCRUD backwards compatibility
  slug: String
${convertToGraphQL(fields, '  ')}
}`;

/*

See https://docs.hasura.io/1.0/graphql/manual/queries/query-filters.html#
 
*/
export const fieldWhereInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}WhereInput {
  _and: [${typeName}WhereInput]
  _not: ${typeName}WhereInput
  _or: [${typeName}WhereInput]
  # will search across all searchable fields at the same time
  search: String
  ${fields
    .map(field => {
      const { name, type } = field;
      if (supportedFieldTypes.includes(type)) {
        const isArrayField = name[0] === '[';
        return `${name}: ${type}_${isArrayField ? 'Array_' : ''}Selector`;
      } else {
        return '';
      }
    })
    .join('\n')}
}`;

export const fieldOrderByInputTemplate = ({ typeName, fields }) =>
  `input ${typeName}OrderByInput {
  foo: OrderBy
  bar: OrderBy
  ${fields.map(({ name }) => `${name}: OrderBy`).join('\n')}
}`;
