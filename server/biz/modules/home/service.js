
'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const multer = require('multer');
const mime = require('mime');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, PERM_PUBLIC ,ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');

//Collection

const Declare = require('./../cfg_selt_declare/models/cfg_seft_declare');
const DeclareDetails = require('./../cfg_selt_declare/models/cfg_seft_declare_detail');


module.exports = {
  settings: {
    name: 'home',
    version: 1,
    namespace: 'home',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_PUBLIC,
    role: 'user',
    collection: null,
  },

  actions: {
   
    getData: {
      cache: false,
      handler(ctx) {
        return this.getAllData();
      }
    },
  },

  methods: {
    async getAllData() {
      let lstDeclareDetail = await DeclareDetails.find().sort({'option_code':1,'orderNo':1})
      let declares = await Declare.find().sort({'option_code':1,'orderNo':1})
      let data = [];
      declares.forEach(declare => {
        let nDeclare = {};
        let declaredetails = [];
        lstDeclareDetail.forEach(declareDetail => {
          if(declareDetail.option_code == declare.option_code){
            declaredetails.push(declareDetail);
          }
        })
        nDeclare = {
          createdAt : declare.createdAt,
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
    }
  },

  init(ctx) {
  },
};
