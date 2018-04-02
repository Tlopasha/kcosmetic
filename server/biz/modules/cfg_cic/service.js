
'use strict';

const _ = require('lodash');
const ConfigCic = require('./models/cfg_cic');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'ciccfg',
    version: 1,
    namespace: 'ciccfg',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: ConfigCic,
  },

  actions: {
    getData: {
      cache: false,
      handler(ctx) {
        const { searchText, size, skip } = ctx.params;
        const user = ctx.user;
        return this.getData(ctx, {
          page: {
            size,
            skip,
          },
          searchText: searchText
        }, user);
      }
    },

    saveCicCfg: {
      handler(ctx) {
        const data = ctx.params;

        let {isNew} = ctx.params;

        const user = ctx.user;
        if (isNew) {
          delete data.isNew;
          return this.InsertCicCfg(data);
        } else {
          delete data.isNew;
          return this.updateCicCfg(data);
        }
      }
    },

    deleteCicCfg: {
      
      handler(ctx) {
        const { id } = ctx.params;
        return this.deleteCicCfg(id);
      }
    }
  },

  methods: {
  
    async getData(ctx, params, user) {
      let condition = {
        $or: [
          { cib_msg: { $regex: `.*${params.searchText || ''}.*` } },
          { cic_sys_rslt: { $regex: `.*${params.searchText || ''}.*` } },
          { cic_result: { $regex: `.*${params.searchText || ''}.*` } },
          //{ point: { $regex: `.*${params.searchText || ''}.*` } },
          //{ random_point: { $regex: `.*${params.searchText || ''}.*` } },
        ]
      };
     
      const { skip, size } = params.page;
      let [total, data] = await Promise.all([
        ConfigCic.count(condition),
        ConfigCic.find(condition).skip(skip).limit(size),
      ]);

      return { total, data };
    },


    async updateCicCfg(data) {
      const { _id } = data;

       
      let duplicatedItem = await ConfigCic.findOne({ cib_msg: data.cib_msg })
      //Incase update
      if (duplicatedItem  && duplicatedItem._id != _id) {
        return { status: 'ERROR', msgContent: 'Messeger đã tồn tại' };
      }

      await ConfigCic.findOneAndUpdate({ _id }, {
        $set: {
          cib_msg: data.cib_msg,
          cic_sys_rslt: data.cic_sys_rslt,
          cic_result: data.cic_result,
          point: data.point,
          random_point : data.random_point
        }
      });
      return { status: 'OK' };
    },

    async InsertCicCfg(data) {

      let duplicatedItem = await ConfigCic.findOne({ cib_msg: data.cib_msg })
      //Incase update
      if (duplicatedItem) {
        return { status: 'ERROR', msgContent: 'Messeger đã tồn tại' };
      }

      await ConfigCic.create(data);
      return { status: 'OK' };
    },

    deleteCicCfg(id) {
      return ConfigCic.remove({ _id: id });
    },
  },

  init(ctx) {
  },
};
