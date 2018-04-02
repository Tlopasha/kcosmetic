'use strict';

const logger = require('../core/logger');
const config = require('../config');
const fs = require('fs');
const mkdirp = require('mkdirp');

// Create data folder if not exist
if (!fs.existsSync(config.dataFolder)) {
  mkdirp.sync(config.dataFolder);
}

const uploadDir = `${global.rootPath}/uploads`;
if (!fs.existsSync(uploadDir)) {
  mkdirp.sync(uploadDir);
}

const tmpDir = `${global.rootPath}/tmp`;
if (!fs.existsSync(tmpDir)) {
  mkdirp.sync(tmpDir);
}

const distDir = `${global.rootPath}/dist`;
if (!fs.existsSync(distDir)) {
  mkdirp.sync(distDir);
}

// Print to console the full config in dev mode
if (!config.isProductionMode()) {
  logger.info('Loaded configuration:');
  logger.info(config);
  logger.info();
}
