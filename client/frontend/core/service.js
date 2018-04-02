import axios from 'axios';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

window.gql = gql; // debug

const httpLink = createHttpLink({ uri: '/graphql' });

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('token') || null
    }
  });
  return forward(operation);
});


const link = middlewareLink.concat(httpLink);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

export default class Service {

  /**
   * Creates an instance of Service.
   * 
   * @param {any} namespace  namespace of service (without trailing '/')
   * 
   * @memberOf Service
   */
  constructor(namespace, vm, socketOpts) {
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: `/api/${namespace}/`,
      responseType: 'json'
    });
  }

  /**
   * Call a service action via REST API
   * 
   * @param {any} action  name of action
   * @param {any} params  parameters to request
   * @returns  {Promise}
   * 
   * @memberOf Service
   */
  rest(action, params) {
    return new Promise((resolve, reject) => {
      this.axios.request(action, {
        method: 'post',
        data: params
      }).then((response) => {
        if (response.data && response.data.data)
          resolve(response.data.data);
        else
          reject(response);
      }).catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          console.error('REST request error!', error.response.data.error);
          reject(error.response.data.error);
        } else
          reject(error);
      });
    });
  }

  /* 
    Example:
      window.counterService.query(gql`query($code: String!) {post(code: $code) { code title } }`, { code: "Jk8Pqb5MAN" })
  */

  /**
   * Call a service action via GraphQL query
   * 
   * @param {any} query     GraphQL query string
   * @param {any} variables   variables of query
   * @param {any} fragments  fragments of query
   * @returns {Promise}
   * 
   * @memberOf Service
   */
  query(query, variables, fragments) {
    return apolloClient.query({
      query,
      variables,
      fragments,
      forceFetch: true
    }).then((result) => {
      // console.log("GraphQL response: ", result);

      return result.data;
    }).catch((error) => {
      // console.error("GraphQL query error", error);

      let err = error;
      if (error.graphQLErrors && error.graphQLErrors.length > 0)
        err = error.graphQLErrors[0];

      throw err;
    });
  }

  // under dev
  watchQuery(query, variables, fragments, pollInterval) {
    return apolloClient.watchQuery({
      query,
      variables,
      fragments,
      pollInterval,
      forceFetch: true,
    });
  }


  /**
   * Call a service action via GraphQL mutation
   * 
   * @param {any} mutation   GraphQL mutation string
   * @param {any} variables   variables of query
   * @param {any} fragments  fragments of query
   * @returns {Promise}
   * 
   * @memberOf Service
   */
  mutate(mutation, variables, fragments) {
    return apolloClient.mutate({
      mutation,
      variables,
      fragments
    }).then((result) => {
      //console.log("GraphQL response: ", result);

      return result.data;
    }).catch((error) => {
      //console.error("GraphQL query error", error);

      let err = error;
      if (error.graphQLErrors && error.graphQLErrors.length > 0)
        err = error.graphQLErrors[0];

      throw err;
    });
  }
}
