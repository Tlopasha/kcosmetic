'use strict';

const C = require('../../../../core/constants');
const fs = require('fs');
const path = require('path');

const db = require('../../../../core/mongo');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};


const ConfigCicSchema = new Schema({

  cib_msg: {type:String},
  cic_sys_rslt: {type:String},
  cic_result: {type:String},
  point: {type:Number},
  random_point: {type:Number},
  
  metadata: {}

}, schemaOptions);


const ConfigCic = mongoose.model('ConfigCic', ConfigCicSchema);

module.exports = ConfigCic;
