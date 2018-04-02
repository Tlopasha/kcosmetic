'use strict';

const logger = require('../../../core/logger');
const config = require('../../../config');
const C = require('../../../core/constants');

const _ = require('lodash');

let personService;

module.exports = {
  settings: {
    name: 'session',
    version: 1,
    namespace: 'session',
    rest: true,
    ws: true,
    graphql: true,
    permission: C.PERM_LOGGEDIN,
    role: 'user'
  },

  actions: {
    // return my User model
    me(ctx) {
      return Promise.resolve(ctx.user).then(doc => {
        return personService.toJSON(doc);
      });
    }
  },

  init(ctx) {
    personService = this.services('persons');
  },

  graphql: {
    query: `
      me: Person
    `,

    mutation: `
    `,

    resolvers: {
      Query: {
        me: 'me'
      }
    }
  }
};

/*
## GraphiQL test ##
# Get my account
query me {
  me {
    ...personFields
  }
}
# Get list of online users
query getOnlineUser {
  onlineUsers {
    ...personFields
  }
}
fragment personFields on Person {
  code
  fullName
  email
  username
  roles
  verified
  avatar
  lastLogin
  locale
  
  posts(sort: "-createdAt") {
    code
    title
  }
}
*/
