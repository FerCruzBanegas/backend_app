import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLString as StringType,
  GraphQLList as List
} from 'graphql';

import { SiteSettings } from '../models';
import SiteSettingsType from './SiteSettingsType';

const ResultType = new ObjectType({
  name: 'ResultType',
  fields: {
    user: {
      type: StringType
    },
    driver: {
      type: StringType
    },
  }
});

const CommonResultType = new ObjectType({
  name: 'CommonResultType',
  fields: {
    appStoreURL: {
      type: ResultType
    },
    playStoreURL: {
      type: ResultType
    },
    siteSettings: {
      type: new List(SiteSettingsType),
      async resolve() {
        return await SiteSettings.findAll({
          attributes: ['name', 'value'],
          where: {
            name: {
              $in: ['siteName', 'homeLogo']
            }
          }
        });
      }
    },
  }
});


const CommonType = new ObjectType({
  name: 'CommonType',
  fields: {
    errorMessage: { type: StringType },
    status: { type: IntType },
    result: {
      type: CommonResultType
    }
  },
});

export default CommonType;
