
'use strict';

const _ = require('lodash');
const Cfgsetting = require('./models/cfg_setting');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const { LAST_CHECK_DAY, MAX_TIMES_SEARCH } = require('../../libs/constants');
const { code_generator } = require('../../../biz/libs/common');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'cfgsetting',
    version: 1,
    namespace: 'cfgsetting',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: Cfgsetting,
  },

  actions: {
    getData: {
      cache: false,
      handler(ctx) {
        return this.getData().then((configs) => {
          const setting = {}
          configs.forEach(c => {
            setting[c.cfg_cd] = c.cfg_vl;
          })
          return setting;
        })
      }
    },

    saveSetting: {
      handler(ctx) {
        const data = ctx.params;
        return Promise.all(Object.keys(data).map(k => {
          return this.saveSetting({ cfg_cd: k, cfg_vl: data[k] });
        }));
      }
    },

  },

  methods: {

    async getData() {
      let data = await Cfgsetting.find({ cfg_cd: { $in: [LAST_CHECK_DAY, MAX_TIMES_SEARCH] } });
      if(!data){
        console.log('data is null')
        data = {
          LAST_CHECK_DAY : '',
          MAX_TIMES_SEARCH : ''
        }
      }
      return data;
    },

    saveSetting({ cfg_cd, cfg_vl }) {
      if (_.isArray(cfg_vl)) {
        cfg_vl = cfg_vl.join(',')
      }
      return Cfgsetting.findOneAndUpdate({ cfg_cd: cfg_cd }, { $set: { cfg_cd, cfg_vl } }, { upsert: true }).then(c => {
        return {
          cfg_cd: cfg_cd,
          cfg_vl: cfg_vl,
        }
      })
    },


  },

  init(ctx) {
  },
};
