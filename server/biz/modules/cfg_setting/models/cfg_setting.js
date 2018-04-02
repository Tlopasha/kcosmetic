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


let ConfigSettingSchema = new Schema({

  cfg_cd: {type:String},
  cfg_vl: {type:String},
  
  metadata: {}

}, schemaOptions);


let ConfigSetting = mongoose.model('ConfigSetting', ConfigSettingSchema);

module.exports = ConfigSetting;
