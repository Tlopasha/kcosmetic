

'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const { json } = require('body-parser');
const { ObjectId } = mongoose.Types;
const VerifyCode = require('./models/verify_code');

const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR, PERM_PUBLIC } = require('../../../core/constants');
const { code_generator } = require('../../../biz/libs/common');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'sms',
    version: 1,
    namespace: 'sms',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_PUBLIC,
    role: 'user',
    collection: VerifyCode
  },

  actions: {
    generateCode: {
      async handler(ctx) {
        const { cmnd, phone } = ctx.params;
        console.log('CMND', cmnd)
        console.log('SDT', phone)

        //Insert To DB
        const res = await this.insertVerifyCode({ cmnd, phone })
        return res;
      }
    },

  },

  methods: {
    async insertVerifyCode(data) {
      //Generate a verify code
      const code = code_generator();
      const res = await VerifyCode.create({ ...data, code });
      console.log('>>> insertVerifyCode >>> ', res);
      return { code };
    },
  },

  init(ctx) {
  },
};
