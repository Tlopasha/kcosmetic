'use strict';

const logger = require('./logger');
const config = require('../config');

const chalk = require('chalk');
const mongoose = require('mongoose');

module.exports = function () {
  let db;

  logger.info();

  mongoose.Promise = global.Promise;

  if (mongoose.connection.readyState !== 1) {
    logger.info('Connecting to Mongo ' + config.db.uri + '...');
    db = mongoose.connect(config.db.uri, config.db.options, function mongoAfterConnect(err) {
      if (err) {
        logger.error('Could not connect to MongoDB!');
        return logger.error(err);
      }

      mongoose.set('debug', config.isDevMode());
    });

    mongoose.connection.on('error', function mongoConnectionError(err) {
      if (err.message.code === 'ETIMEDOUT') {
        logger.warn('Mongo connection timeout!', err);
        setTimeout(() => {
          mongoose.connect(config.db.uri, config.db.options);
        }, 1000);
        return;
      }

      logger.error('Could not connect to MongoDB!');
      return logger.error(err);
    });

    mongoose.connection.once('open', function mongoAfterOpen() {
      logger.info(chalk.yellow.bold('Mongo DB connected.'));
      logger.info();

      if (config.isTestMode()) {
        logger.warn('Drop test database...');
        //mongoose.connection.db.dropDatabase((err) => {
        require('./seed-db').UserSeed();
        // require('./seed-db').SeftDeclareSeed();
        // require('./seed-db').SeftDeclareDetailSeed();
        // require('./seed-db').CfgSettingSeed();
        // require('./seed-db').ConfigCicSeed();
        // require('./seed-db').ResultSeed();
        //);
      }
      else {
        if (!config.isProduction) {
          require('./seed-db').UserSeed();
          // require('./seed-db').SeftDeclareSeed();
          // require('./seed-db').SeftDeclareDetailSeed();
          // require('./seed-db').CfgSettingSeed();
          // require('./seed-db').ConfigCicSeed();
          // require('./seed-db').ResultSeed();
        }
      }
    });


  } else {
    logger.info('Mongo already connected.');
    db = mongoose;
  }

  return db;
};
