'use strict';

const logger = require('./logger');
const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('./config');

// Create data folder if not exist
if (!fs.existsSync(config.dataFolder)) {
  mkdirp.sync(config.dataFolder);
}

if (!config.isProductionMode()) {
  logger.info('Loaded configuration:');
  logger.info(config);
  logger.info();
}

