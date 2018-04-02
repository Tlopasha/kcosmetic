'use strict';

let C = require('../../../../core/constants');
let fs = require('fs');
let path = require('path');

let db = require('../../../../core/mongo');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

//ConfigSelfDeclareDetail Schema
let ConfigSelfDeclareDetailSchema = new Schema({
  option_code: {type:String},
  option_detail: {type:String},
  option_range_from: {type:Number},
  option_range_to: {type:Number},
  option_score: {type:Number},
  orderNo : {type:Number},
  metadata: {}
}, schemaOptions);

let ConfigSelfDeclareDetail = mongoose.model('ConfigSelfDeclareDetail', ConfigSelfDeclareDetailSchema);

module.exports =  ConfigSelfDeclareDetail;
