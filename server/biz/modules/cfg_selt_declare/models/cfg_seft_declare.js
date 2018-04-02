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
let ConfigSelfDeclareSchema = new Schema({
  option: {type:String},
  option_code: {type:String},
  value: {type:String, default: ''},
  isFormToQuestion: {type:Boolean},
  orderNo : {type:Number},
  metadata: {}
}, schemaOptions);
let ConfigSelfDeclare = mongoose.model('ConfigSelfDeclare', ConfigSelfDeclareSchema);


module.exports = ConfigSelfDeclare
