'use strict';

const _ = require('lodash');
const ConfigCic = require('../cfg_cic/models/cfg_cic');
const UserReferal = require('../user/models/UserReferal');
const CheckLog = require('../phone_check/models/check_log');
const PhoneCheck = require('../phone_check/models/phone_check');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');
const year = new Date().getFullYear();

module.exports = {
  settings: {
    name: 'dashboard',
    version: 1,
    namespace: 'dashboard',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: ConfigCic,
  },

  actions: {
    getBigChartData: {
      handler(ctx) {
        const { _id, user_type } = ctx.user;        
        return this.getBigChartData(_id, user_type);
      }
    },

    getMonthlyChartDatas: {
      handler(ctx) {
        //console.log('ctx.user >>>>>>>>',ctx.user);        
        const { _id, user_type } = ctx.user;
        return this.getMonthlyChartDatas(_id, user_type);
      }
    },

    getDailyChartDatas: {
      handler(ctx) {
        const { _id, user_type } = ctx.user;        
        return this.getDailyChartDatas(_id, user_type);
      }
    },

    getReferals: {
      handler(ctx) {
        const { _id, user_type } = ctx.user;        
        return this.getReferals(_id, user_type);
      }
    },

    getLogInfo: {
      handler(ctx) {
        const { size, skip } = ctx.params;
        console.log('size >>>>>>', size)
        const { _id, user_type } = ctx.user;                
        return this.getLogInfo(_id, user_type, size, skip);
      }
    },
  },

  methods: {

    async getBigChartData(_id, user_type) {

      let referalKeysObj = await UserReferal.find({ 'user_id': _id }, { referal_key: 1 })
      let referalKeys = [];
      referalKeysObj.forEach(item => {
        referalKeys.push(item.referal_key)
      });

      // let condition = {};
      // if(referalKeys.length > 0)
      //   condition.push({ referal_key: { $in: referalKeys } })
        
      let m01,m02,m03,m04,m05,m06,m07,m08,m09,m10,m11,m12
      if(user_type === 'admin'){
        m01 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-01-01'), $lte: new Date(year + '-01-31').setHours(30, 59, 59, 999) } });
        m02 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-02-01'), $lte: new Date(year + '-02-31').setHours(30, 59, 59, 999) } });
        m03 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-03-01'), $lte: new Date(year + '-03-31').setHours(30, 59, 59, 999) } });
        m04 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-04-01'), $lte: new Date(year + '-04-31').setHours(30, 59, 59, 999) } });
        m05 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-05-01'), $lte: new Date(year + '-05-31').setHours(30, 59, 59, 999) } });
        m06 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-06-01'), $lte: new Date(year + '-06-31').setHours(30, 59, 59, 999) } });
        m07 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-07-01'), $lte: new Date(year + '-07-31').setHours(30, 59, 59, 999) } });
        m08 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-08-01'), $lte: new Date(year + '-08-31').setHours(30, 59, 59, 999) } });
        m09 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-09-01'), $lte: new Date(year + '-09-31').setHours(30, 59, 59, 999) } });
        m10 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-10-01'), $lte: new Date(year + '-10-31').setHours(30, 59, 59, 999) } });
        m11 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-11-01'), $lte: new Date(year + '-11-31').setHours(30, 59, 59, 999) } });
        m12 = await CheckLog.count({  createdAt: { $gte: new Date(year + '-12-01'), $lte: new Date(year + '-12-31').setHours(30, 59, 59, 999) } });
      }else{
        m01 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-01-01'), $lte: new Date(year + '-01-31').setHours(30, 59, 59, 999) } });
        m02 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-02-01'), $lte: new Date(year + '-02-31').setHours(30, 59, 59, 999) } });
        m03 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-03-01'), $lte: new Date(year + '-03-31').setHours(30, 59, 59, 999) } });
        m04 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-04-01'), $lte: new Date(year + '-04-31').setHours(30, 59, 59, 999) } });
        m05 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-05-01'), $lte: new Date(year + '-05-31').setHours(30, 59, 59, 999) } });
        m06 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-06-01'), $lte: new Date(year + '-06-31').setHours(30, 59, 59, 999) } });
        m07 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-07-01'), $lte: new Date(year + '-07-31').setHours(30, 59, 59, 999) } });
        m08 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-08-01'), $lte: new Date(year + '-08-31').setHours(30, 59, 59, 999) } });
        m09 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-09-01'), $lte: new Date(year + '-09-31').setHours(30, 59, 59, 999) } });
        m10 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-10-01'), $lte: new Date(year + '-10-31').setHours(30, 59, 59, 999) } });
        m11 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-11-01'), $lte: new Date(year + '-11-31').setHours(30, 59, 59, 999) } });
        m12 = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(year + '-12-01'), $lte: new Date(year + '-12-31').setHours(30, 59, 59, 999) } });
      }
      

      //console.log({ data: [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12] });

      let data = {
        datas: [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      };

      return data;

    },

    firstDayOfMonth() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const firstDay = new Date(y, m, 1);
      return firstDay;
      // return moment(firstDay).format('YYYY-MM-DD');
    },

   
    currentMonth() {
      const date = new Date();
      const month = date.getMonth() + 1;
      return `${month > 9 ? month : '0' + month}`;
    },

    async getMonthlyChartDatas(_id, user_type) {
      let referalKeysObj = await UserReferal.find({ 'user_id': _id }, { referal_key: 1 })
      let referalKeys = [];
      referalKeysObj.forEach(item => {
        referalKeys.push(item.referal_key)
      });

      //last date of current month
      let lastDay = moment().endOf('month').format('DD');
      
      let currentMonth = this.currentMonth();
      let datas = [];
      let labels = [];
      for (let i = 1; i <= lastDay; i++) {

        if(i < 10)
          i = '0'+i;

        let currentDate = `${year}-${currentMonth}-${i}`;
        let count = 0;
        if(user_type === 'admin')
          count = await CheckLog.count({ createdAt: { $gte: new Date(currentDate), $lte: new Date(currentDate).setHours(30, 59, 59, 999) } });
        else
          count = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(currentDate), $lte: new Date(currentDate).setHours(30, 59, 59, 999) } });
        datas.push(count);
        labels.push(`${i}`);
      }

      return { datas, labels };
    },

    async getReferals(_id, user_type) {
      let referalKeysObj;
      if(user_type === 'admin')
      referalKeysObj = await UserReferal.find();
      else
      referalKeysObj = await UserReferal.find({ 'user_id': _id })
      return { referalKeysObj };
    },

    async getDailyChartDatas(_id, user_type) {
      let referalKeysObj = await UserReferal.find({ 'user_id': _id }, { referal_key: 1 })
      let referalKeys = [];
      referalKeysObj.forEach(item => {
        referalKeys.push(item.referal_key)
      });

      //last date of current month
      //let lastDay = moment().endOf('month').format('DD');
      let currentDateStr = moment().format('YYYY-MM-DD');
      
      
      let currentMonth = this.currentMonth();
      let datas = [];
      let labels = [];
      for (let i = 0; i < 24; i++) {

        if(i < 10)
          i = '0'+i;

        let DateStr = `${currentDateStr} ${i}:00:00`;
        let DateEnd = `${currentDateStr} ${i}:59:59`;
        let count = 0;
        if(user_type === 'admin')
          count = await CheckLog.count({ createdAt: { $gte: DateStr, $lte: DateEnd } });         
        else
          count = await CheckLog.count({ referal_key: { $in: referalKeys }, createdAt: { $gte: DateStr, $lte: DateEnd } });

        datas.push(count);
        labels.push(`${i}`);
      }

      return { datas, labels };
    },

    async getLogInfo(_id, user_type, size, skip) {
      let lastDay = moment().endOf('month').format('DD');
      let currentMonth = this.currentMonth();
      const phonechecks = await PhoneCheck.find({},{ _id: 1, phone_number: 1, identity_number: 1, check_counter: 1 })

      const phonecheckMap = {};
      phonechecks.forEach(item => {
        phonecheckMap[item._id] = item;
      });

      let referalKeysObj = await UserReferal.find({ 'user_id': _id }, { referal_key: 1 })
      let referalKeys = [];
      referalKeysObj.forEach(item => {
        referalKeys.push(item.referal_key)
      });


      let logLst = [];
      let total = 0;
      if(user_type === 'admin'){
        total = await CheckLog.count({ createdAt: { $gte: new Date(`${year}-${currentMonth}-01`), $lte: new Date(`${year}-${currentMonth}-${lastDay}`).setHours(30, 59, 59, 999) } });
        logLst = await CheckLog.find({ createdAt: { $gte: new Date(`${year}-${currentMonth}-01`), $lte: new Date(`${year}-${currentMonth}-${lastDay}`).setHours(30, 59, 59, 999) } })
                        .skip(skip).limit(size);
      }
      else{
        total = await CheckLog.count({referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(`${year}-${currentMonth}-01`), $lte: new Date(`${year}-${currentMonth}-${lastDay}`).setHours(30, 59, 59, 999) }});        
        logLst = await CheckLog.find({referal_key: { $in: referalKeys }, createdAt: { $gte: new Date(`${year}-${currentMonth}-01`), $lte: new Date(`${year}-${currentMonth}-${lastDay}`).setHours(30, 59, 59, 999) }})
                        .skip(skip).limit(size);
      }
        
      let data = [];
      logLst.forEach(item => {
        let phonecheckInfo = phonecheckMap[item.phone_id];
        let fItem = _.merge(item, phonecheckInfo)
        data.push(fItem);
      });


      return { total, data };
    }
    
  },

  init(ctx) { },
};
