
'use strict';

const _ = require('lodash');
const Declare = require('./models/cfg_seft_declare');
const DeclareDetails = require('./models/cfg_seft_declare_detail');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const { code_generator } = require('../../../biz/libs/common');
const moment = require('moment');

module.exports = {
  settings: {
    name: 'cfgselfdeclare',
    version: 1,
    namespace: 'cfgselfdeclare',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: Declare,
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

    getAllData: {
      cache: false,
      handler(ctx) {
        return this.getAllData();
      }
    },

    saveDeclare: {
      handler(ctx) {
        const data = ctx.params;

        let { isNew } = ctx.params;

        const user = ctx.user;
        if (isNew) {
          delete data.isNew;
          return this.insertDeclare(data);
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


    async getAllData() {

      let lstDeclareDetail = await DeclareDetails.find().sort({ 'option_code': 1, 'orderNo': 1 })
      let declares = await Declare.find().sort({ 'option_code': 1, 'orderNo': 1 })
      let data = [];
      declares.forEach(declare => {
        let nDeclare = {};
        let declaredetails = [];
        lstDeclareDetail.forEach(declareDetail => {
          if (declareDetail.option_code == declare.option_code) {
            declaredetails.push(declareDetail);
          }
        })
        nDeclare = {
          createdAt: declare.createdAt,
          isFormToQuestion: declare.isFormToQuestion,
          option: declare.option,
          option_code: declare.option_code,
          orderNo: declare.orderNo,
          updatedAt: declare.updatedAt,
          value: declare.value,
          _id: declare._id,
          declaredetails
        }
        data.push(nDeclare)
      })

      return { data };
    },


    async getData(ctx, params, user) {
      const { skip, size } = params.page;
      let data = [];
      let condition = {
        $or: [
          { option: { $regex: `.*${params.searchText || ''}.*` } }
        ]
      };

      let lstDeclareDetail = await DeclareDetails.find().sort({ 'option_code': 1, 'orderNo': 1 })
      let declares = await Declare.find(condition).skip(skip).limit(size).sort({ 'option_code': 1, 'orderNo': 1 })
      
      declares.forEach(declare => {
        let nDeclare = {};
        let declaredetails = [];
        lstDeclareDetail.forEach(declareDetail => {
          if (declareDetail.option_code == declare.option_code) {
            declaredetails.push(declareDetail);
          }
        })
        nDeclare = {
          createdAt: declare.createdAt,
          isFormToQuestion: declare.isFormToQuestion,
          option: declare.option,
          option_code: declare.option_code,
          orderNo: declare.orderNo,
          updatedAt: declare.updatedAt,
          value: declare.value,
          _id: declare._id,
          declaredetails
        }
        data.push(nDeclare)
      })

      let total = await Declare.count(condition);
      
      // let [total, data] = await Promise.all([
      //   Declare.count(condition),
      //   Declare.aggregate([
      //     {
      //       $lookup:
      //         {
      //           from: 'configselfdeclaredetails',
      //           localField: 'option_code',
      //           foreignField: 'option_code',
      //           as: 'declaredetails'
      //         }
      //     },
      //     {
      //       $sort: { 'declaredetails': 1 }
      //     },
      //     {
      //       $match: { $or: [{ 'option': { $regex: `.*${params.searchText || ''}.*` } }] }
      //     }

      //   ]).skip(skip).limit(size).sort('orderNo')
      // ]);


      return { total, data };
    },


    async updateCicCfg(data) {
      const { option_code } = data;


      let duplicatedItem = await Declare.findOne({ option: data.option })
      //Incase update
      if (duplicatedItem && duplicatedItem.option_code != option_code) {
        return { status: 'ERROR', msgContent: 'Câu Hỏi Đã Tồn Tại' };
      }

      await Declare.findOneAndUpdate({ option_code }, {
        $set: {
          option: data.option,
          isFormToQuestion: data.isFormToQuestion
        }
      });

      //Remove old one
      await DeclareDetails.remove({ option_code: option_code })

      let lstOptionDetails = data.list_option;
      let declareDetailItems = [];
      if (lstOptionDetails){
        let i = 0;
        lstOptionDetails.forEach(element => {
          let declareDetailItem = {
            option_code: option_code,
            option_detail: element.option_detail,
            option_range_from: element.option_range_from,
            option_range_to: element.option_range_to,
            option_score: element.option_score,
            orderNo: element.orderNo ? element.orderNo : i++,
          }
          declareDetailItems.push(declareDetailItem)
        });
      }

      await DeclareDetails.create(declareDetailItems);

      return { status: 'OK' };
    },

    async insertDeclare(data) {

      let declareItem = {
        option: data.option,
        isFormToQuestion: data.isFormToQuestion,
        option_code: code_generator()
      }

      let duplicatedItem = await Declare.findOne({ option: data.option })
      if (duplicatedItem) {
        return { status: 'ERROR', msgContent: 'Câu Hỏi Đã Tồn Tại' };
      }

      // //Incase update
      // if (_user && userEmail && userEmail._id != _user._id) {
      //   return { status: 'ERROR', msgContent: ctx.t('app:emailExitst') };
      // }


      let declareVO = await Declare.create(declareItem);

      let lstOptionDetails = data.list_option;
      let declareDetailItems = [];
      if (lstOptionDetails){
        let i = 0;
        lstOptionDetails.forEach(element => {
          let declareDetailItem = {
            option_code: declareItem.option_code,
            option_detail: element.option_detail,
            option_range_from: element.option_range_from,
            option_range_to: element.option_range_to,
            option_score: element.option_score,
            orderNo: element.orderNo ? element.orderNo : i++,            
          }
          declareDetailItems.push(declareDetailItem)
        });
      }

      let declareDetailVO = await DeclareDetails.create(declareDetailItems);

      return { status: 'OK' };
    },

    async deleteCicCfg(id) {
      //Remove old one
      await DeclareDetails.remove({ option_id: id })
      return Declare.remove({ _id: id });
    },
  },

  init(ctx) {
  },
};
