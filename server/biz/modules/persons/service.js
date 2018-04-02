'use strict';

const logger = require('../../../core/logger');
const config = require('../../../config');
const C = require('../../../core/constants');

const _ = require('lodash');

const User = require('./models/User');

module.exports = {
  settings: {
    name: 'persons',
    version: 1,
    namespace: 'persons',
    rest: true,
    ws: true,
    graphql: true,
    permission: C.PERM_LOGGEDIN,
    role: 'user',
    collection: User,

    modelPropFilter: 'code username fullName avatar lastLogin roles user_type'
  },

  actions: {
    get: {
      cache: true,
      handler(ctx) {
        ctx.assertModelIsExist(ctx.t('app:UserNotFound'));
        return Promise.resolve(ctx.model);
      }
    }
  },

  methods: {},

  graphql: {
    query: `
      # users(limit: Int, offset: Int, sort: String): [Person]
      person(code: String): Person
    `,

    types: `
      type Person {
        code: String!
        fullName: String
        username: String
        roles: [String]
        avatar: String
        user_type: String
        lastLogin: Timestamp
      }
    `,

    mutation: `
      no: String
    `,

    resolvers: {
      Query: {
        //users: "find",
        person: 'get'
      }
    }
  }
};

/* 
## GraphiQL test ##
# Get a person
query getPerson {
  person(code: "O5rNl5Bwnd") {
    ...personFields
  }
}
fragment personFields on Person {
  code
  fullName
  username
  roles
  avatar
  lastLogin
  
  posts(sort: "-createdAt") {
    code
    title
  }
}
*/
