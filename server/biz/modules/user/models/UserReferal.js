'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { autoIncrement } = require('mongoose-plugin-autoinc');

const schemaOptions = {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

const UserReferalSchema = new Schema(
  {
    user_id: { type: Number },
    referal_key: { type: String },
    count: { type: Number, default: 0 }
  },
  schemaOptions
);

/**
 * Auto increment for `_id`
 */
UserReferalSchema.plugin(autoIncrement, {
  model: 'UserReferal',
  startAt: 1
});

UserReferalSchema.methods.increaseReferalCount = function () {
  console.log(this.count);
  this.count = this.count + 1;
  return this.save();
};

const UserReferal = mongoose.model('UserReferal', UserReferalSchema);

module.exports = UserReferal;
