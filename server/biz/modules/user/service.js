
'use strict';

const _ = require('lodash');
const User = require('./models/User');
const UserReferal = require('./models/UserReferal');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');
const { code_generator } = require('../../../biz/libs/common');

module.exports = {
  settings: {
    name: 'user',
    version: 1,
    namespace: 'user',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: User,
  },

  actions: {
    getUsers: {
      cache: false,
      handler(ctx) {
        const { txtName, size, skip } = ctx.params;
        const user = ctx.user;
        return this.getUsersLs(ctx, {
          page: {
            size,
            skip,
          },
          txtName: txtName
        }, user);
      }
    },

    saveUsers: {
      handler(ctx) {
        const userData = ctx.params;
        const user = ctx.user;
        this.validateParams(ctx, true);

        if (userData._id === '') {
          return this.checkExistAndInsertUser(ctx, userData);
        } else {
          return this.updateUser(ctx, userData);
        }
      }
    },

    deleteUser: {

      handler(ctx) {
        const { id } = ctx.params;
        return this.deleteUser(id);
      }
    }
  },

  methods: {

    validateParams(ctx, strictMode) {
      if (strictMode || ctx.hasParam('email'))
        ctx
          .validateParam('email')
          .trim()
          .notEmpty('Email cannot be empty')
          .end();

      if (ctx.hasValidationErrors())
        throw ctx.errorBadRequest(ERR_VALIDATION_ERROR, ctx.validationErrors);
    },

    async getUsersLs(ctx, params, user) {
      const { _id } = ctx.user;
      
      let condition = {
        $or: [
          { fullName: { $regex: `.*${params.txtName || ''}.*` } },
          { email: { $regex: `.*${params.txtName || ''}.*` } },
          { username: { $regex: `.*${params.txtName || ''}.*` } },
          { phone: { $regex: `.*${params.txtName || ''}.*` } }
        ],
        
        $and : [
          { _parent_id : _id }
        ]
      };

      const { skip, size } = params.page;
      let [total, data] = await Promise.all([
        User.count(condition),
        User.find(condition).skip(skip).limit(size),
      ]);

      //remove admin account out of list
      let userIdx = _.findIndex(data, { username: user.username });
      if (userIdx != -1) {
        data.splice(userIdx, 1);
        total = total - 1;
      }

      return { total, data };
    },


    async updateUser(ctx, user) {
      const { username } = user;

      //if have change pwd
      if (user.password != '') {
        let userPwd = await User.findOne({ username });
        userPwd.password = user.password;
        await userPwd.save();
      }
      let existedUser = await User.findOne({ email: user.email });
      //Incase update
      if (existedUser && existedUser.username != user.username) {
        return { status: 'ERROR', msgContent: ctx.t('app:emailExitst') };
      }

      await User.findOneAndUpdate({ username }, {
        $set: {
          activeFlag: user.activeFlag,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          user_type: user.user_type,
          logo_url: user.logo_url,
          disableFlg: user.disableFlg
        }
      });
      return { status: 'OK' };
    },

    async checkExistAndInsertUser(ctx, user) {
      let _user = await User.findOne({ username: user.username })
      if (_user) {
        return { status: 'ERROR', msgContent: ctx.t('app:usrNmExist') };
      }

      //check double user
      let userEmail = await User.findOne({ email: user.email });
      //incase insert new user
      if (!_user && userEmail) {
        return { status: 'ERROR', msgContent: ctx.t('app:emailExitst') };
      }

      //Incase update
      if (_user && userEmail && userEmail._id != _user._id) {
        return { status: 'ERROR', msgContent: ctx.t('app:emailExitst') };
      }

      user.activeFlag = 'Y';
      user.api_key = code_generator(10);
      user._parent_id = ctx.user._id;
      delete user._id;
      let userVO = await User.create(user);

      //Default createReferalKey
      await this.createReferalKey({ user_id: userVO._id, referal_key: userVO.username })

      return { status: 'OK' };
    },

    deleteUser(id) {
      return User.remove({ _id: id });
      //return User.findOneAndUpdate({ _id: id}, { $set: { disableFlg: 'Y' } });
    },

    async increaseReferalCount({ referal_key }) {
      const uRef = await UserReferal.findOne({ referal_key });
      if (!uRef) {
        return false;
      }
      return UserReferal.findOneAndUpdate(
        { referal_key },
        { count: (uRef.count += 1) },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      //return uRef.increaseReferalCount();
    },

    createReferalKey({ user_id, referal_key }) {
      return UserReferal.findOneAndUpdate(
        { user_id, referal_key },
        { user_id, referal_key, count: 0 },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  },

  init(ctx) {
  },
};
