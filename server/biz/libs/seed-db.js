'use strict';

const _ = require('lodash');
const moment = require('moment');

const User = require('../../models/User');
const logger = require('../../core/logger');

const seedData = async() => {
  logger.info('Seeding data...');
  return Promise.all([]).then(async(data) => {
    return true
  }).then(() => {
    logger.info('Seeding Done');
    return true
  })
}


module.exports = function() {
  return seedData();
};
