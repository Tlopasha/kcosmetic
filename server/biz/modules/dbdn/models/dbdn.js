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


const DbdnSchema = new Schema({

  name: { type: String },
  adress: { type: String },
  law: { type: String },

  metadata: {}

}, schemaOptions);


const dbdn = mongoose.model('dbdn', DbdnSchema);

module.exports = dbdn;
