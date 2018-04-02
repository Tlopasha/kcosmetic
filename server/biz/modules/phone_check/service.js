'use strict';

const _ = require('lodash');
const CheckLog = require('./models/check_log');
const PhoneCheck = require('./models/phone_check');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'phonecheck',
    version: 1,
    namespace: 'phonecheck',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: CheckLog,
  },

  actions: {
    getData: {
      cache: false,
      handler(ctx) {
        const { searchText, size, skip, startDate, endDate } = ctx.params;
        const user = ctx.user;
        return this.getData(ctx, {
          page: {
            size,
            skip,
          },
          searchText: searchText,
          startDate : startDate,
          endDate : endDate
        }, user);
      }
    },

    resetCouter: {
      handler(ctx) {
        const data = ctx.params;
        return this.resetCouter(data);
      }
    },

  },

  methods: {

    async getData(ctx, params, user) {
      
      const { startDate, endDate, searchText } = params;
      


      //Condition in Phone Check
      let pConditions = {
        $or: [
          { identity_number: { $regex: `.*${searchText || ''}.*` } },
          { phone_number: { $regex: `.*${searchText || ''}.*` } },
        ]
      };

      const phonechecks = await PhoneCheck
        .find(pConditions, { _id: 1, phone_number: 1, identity_number: 1, check_counter: 1 })

      const phonecheckMap = {};
      phonechecks.forEach(item => {
        phonecheckMap[item._id] = item;
      });

      const phone_check_ids = Object.keys(phonecheckMap);

      let condition = { $and: [{}] };
      condition['$and'].push({ phone_id: { $in: phone_check_ids } })

      
      if(startDate && endDate){
        let start = startDate.replace(/-/g,'') + '000000';
        let end = endDate.replace(/-/g,'') + '235959';
        condition['$and'].push({ check_time : { $gte: start, $lte: end }} )
      }
      

      condition['$and'].push({
        $or: [
          { check_time: { $regex: `.*${searchText || ''}.*` } },
        ]
      });

      const { skip, size } = params.page;
      let total = await CheckLog.count(condition);


      let logLst = await CheckLog.find(condition).skip(skip).limit(size);

      let data = [];
      logLst.forEach(item => {
        let phonecheckInfo = phonecheckMap[item.phone_id];
        let fItem = _.merge(item, phonecheckInfo)
        data.push(fItem);
      });

      // data = data.map(c => {
      //         return {
      //             ...c,
      //             ...phonecheckMap[c.phone_id],
      //           };
      //         });

      return { total, data };
    },


    async resetCouter(data) {
      const { phone, check_counter } = data;
      //Update check_counter by Phone
      await PhoneCheck.updateMany({ 'phone_number': phone }, {
        $set: { check_counter: check_counter }
      });

      return { status: 'OK' };
    },

  },

  init(ctx) {},
};