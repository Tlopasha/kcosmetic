'use strict';
/**
 * Copyright © 2016 LTV Co., Ltd. All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by luc <luc@ltv.vn> on Jan 24, 2017
 */

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
