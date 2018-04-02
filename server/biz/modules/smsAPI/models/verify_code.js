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
let VerifyCodeSchema = new Schema({
  cmnd: {type:String},
  phone: {type:String},
  code: {type:String},
  isChecked: {type:Boolean, default : false},
  metadata: {}
}, schemaOptions);
let VerifyCode = mongoose.model('VerifyCode', VerifyCodeSchema);

module.exports = VerifyCode
