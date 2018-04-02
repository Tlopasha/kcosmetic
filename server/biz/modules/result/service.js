'use strict';

const _ = require('lodash');
const Result = require('./models/result');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'result',
    version: 1,
    namespace: 'result',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: Result,
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

    saveResult: {
      handler(ctx) {
        const data = ctx.params;

        let { isNew } = ctx.params;

        const user = ctx.user;
        if (isNew) {
          delete data.isNew;
          return this.InsertResult(data);
        } else {
          delete data.isNew;
          return this.UpdateResult(data);
        }
      }
    },

    deleteResult: {

      handler(ctx) {
        const { id } = ctx.params;
        return this.deleteResult(id);
      }
    }
  },

  methods: {

    async getData(ctx, params, user) {
      let condition = {
        $or: [
          { loan: { $regex: `.*${params.searchText || ''}.*` } },
          //{ point: { $regex: `.*${params.searchText || ''}.*` } },
          //{ random_point: { $regex: `.*${params.searchText || ''}.*` } },
        ]
      };

      const { skip, size } = params.page;
      let [total, data] = await Promise.all([
        Result.count(condition),
        Result.find(condition).skip(skip).limit(size),
      ]);

      return { total, data };
    },


    async UpdateResult(data) {
      const { _id } = data;


      // let duplicatedItem = await Result.findOne({ cib_msg: data.cib_msg })
      // //Incase update
      // if (duplicatedItem && duplicatedItem._id != _id) {
      //   return { status: 'ERROR', msgContent: 'Messeger đã tồn tại' };
      // }

      await Result.findOneAndUpdate({ _id }, {
        $set: {
          isAccept: data.isAccept,
          point_from: data.point_from,
          point_to: data.point_to,
          loan: data.loan,
          duration: data.duration,
          interest_rate : data.interest_rate
        }
      });
      return { status: 'OK' };
    },

    async InsertResult(data) {

      // let duplicatedItem = await Result.findOne({ cib_msg: data.cib_msg })
      // //Incase update
      // if (duplicatedItem) {
      //   return { status: 'ERROR', msgContent: 'Messeger đã tồn tại' };
      // }

      await Result.create(data);
      return { status: 'OK' };
    },

    deleteResult(id) {
      return Result.remove({ _id: id });
    },
  },

  init(ctx) {},
};
