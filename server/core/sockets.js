'use strict';

let logger = require('./logger');
let config = require('../config');

let path = require('path');
let fs = require('fs');
let http = require('http');
let _ = require('lodash');

let cookieParser = require('cookie-parser');
let passport = require('passport');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

let Services; // circular references

let self = {
  /**
   * Mongo store instance.
   * We will assign it in `init`
   */
  mongoStore: null,

  /**
   * 
   * @param  {Object} app Express App
   * @param  {Object} db  MongoDB connection
   */
  init(app, db) {
    // Create a MongoDB storage object
    self.mongoStore = new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessions.collection,
      autoReconnect: true
    });

    // Create a new HTTP server
    let server = http.createServer(app);

    return server;
  }
};

module.exports = self;
