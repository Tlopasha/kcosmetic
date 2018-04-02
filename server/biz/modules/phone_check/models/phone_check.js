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
let PhoneCheckSchema = new Schema({
  search_time: {type:String},
  identity_number: {type:String},
  phone_number: {type:String},
  check_counter: {type:String},
  last_check_time: {type:String},
  metadata: {}
}, schemaOptions);
let PhoneCheck = mongoose.model('PhoneCheck', PhoneCheckSchema);


module.exports = PhoneCheck
