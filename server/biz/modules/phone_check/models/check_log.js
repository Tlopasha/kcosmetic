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

//ConfigSelfDeclareSchema Schema
let CheckLogSchema = new Schema({
  phone_id: {type:String},
  check_time: {type:String},
  cid_return_time: {type:String},
  cid_result: {type:String},
  cib_point: {type:String},
  cib_random_point: {type:String},
  self_declare_info: {type:Array},
  final_score: {type:String},
  status: {type:String, default:'saved'},
  referal_key: {type:String},
  api_key: {type:String},
  metadata: {}
}, schemaOptions);
let CheckLog = mongoose.model('CheckLog', CheckLogSchema);


module.exports = CheckLog
