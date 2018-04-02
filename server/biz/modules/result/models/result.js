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


const ResultSchema = new Schema({

  isAccept: { type: Boolean },
  point_from: { type: Number },
  point_to: { type: Number },
  loan: { type: String },
  duration: { type: String },
  interest_rate: { type: String },

  metadata: {}

}, schemaOptions);


const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;
