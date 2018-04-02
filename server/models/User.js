'use strict';

const config = require('../config');
const logger = require('../core/logger');
const C = require('../core/constants');
const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const db = require('../core/mongo');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashids = require('../libs/hashids')('users');
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

let validateLocalStrategyProperty = function (property) {
  return (this.provider !== 'local' && !this.updated) || property.length;
};

let validateLocalStrategyPassword = function (password) {
  return this.provider !== 'local' || (password && password.length >= 6);
};

let UserSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: '',
      validate: [validateLocalStrategyProperty, 'Please fill in your full name']
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
      default: '',
      validate: [validateLocalStrategyProperty, 'Please fill in your email'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      required: 'Please fill in a username',
      trim: true,
      match: [/^[\w][\w\-\._\@]*[\w]$/, 'Please fill a valid username']
    },
    password: {
      type: String,
      default: '',
      validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    passwordLess: {
      type: Boolean,
      default: false
    },
    passwordLessToken: {
      type: String
    },
    provider: {
      type: String,
      default: 'local'
    },
    // profile: {
    //   name: { type: String },
    //   gender: { type: String },
    //   picture: { type: String },
    //   location: { type: String }
    // },
    socialLinks: {
      facebook: { type: String, unique: true, sparse: true },
      twitter: { type: String, unique: true, sparse: true },
      google: { type: String, unique: true, sparse: true },
      github: { type: String, unique: true, sparse: true }
    },
    roles: {
      type: [
        {
          type: String,
          enum: [C.ROLE_ADMIN, C.ROLE_USER, C.ROLE_GUEST]
        }
      ],
      default: [C.ROLE_USER]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    verified: {
      type: Boolean,
      default: false
    },

    verifyToken: {
      type: String
    },

    apiKey: {
      type: String,
      unique: true,
      index: true,
      sparse: true
    },

    lastLogin: {
      type: Date
    },

    locale: {
      type: String
    },

    status: {
      type: Number,
      default: 1
    },

    referal_key: { type: String, unique: true, index: true },
    api_key: { type: String, unique: true, index: true },
    exp_date: { type: Date },
    _parent_id: { type: Number },
    acc_money: { type: String },
    api_price: { type: String },
    phone: { type: String },
    user_type: { type: String },
    logo_url: { type: String },
    disableFlg: { type: Boolean, default: false },

    metadata: {}
  },
  schemaOptions
);

/**
 * Virtual `code` field instead of _id
 */
UserSchema.virtual('code').get(function () {
  return this.encodeID();
});

/**
 * Auto increment for `_id`
 */
UserSchema.plugin(autoIncrement, {
  model: 'User',
  startAt: 1
});

/**
 * Password hashing
 */
UserSchema.pre('save', function (next) {
  let user = this;
  if (!user.referal_key) user.referal_key = user.username;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

/**
 * Password compare
 */
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    cb(err, isMatch);
  });
};

/**
 * Virtual field for `avatar`.
 */
UserSchema.virtual('avatar').get(function () {
  // Load picture from profile
  if (this.profile && this.profile.picture) return this.profile.picture;

  // Generate a gravatar picture
  if (!this.email) return 'https://gravatar.com/avatar/?s=64&d=wavatar';

  let md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=64&d=wavatar';
});

/**
 * Encode `_id` to `code`
 */
UserSchema.methods.encodeID = function () {
  return hashids.encodeHex(this._id);
};

/**
 * Decode `code` to `_id`
 */
UserSchema.methods.decodeID = function (code) {
  return hashids.decodeHex(code);
};

let User = mongoose.model('User', UserSchema);

module.exports = User;
