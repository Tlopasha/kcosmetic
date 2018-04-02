'use strict';

let logger = require('../../../core/logger');
let config = require('../../../config');
const {
  PERM_LOGGEDIN,
  ERR_VALIDATION_ERROR,
  PERM_OWNER
} = require('../../../core/constants');
let _ = require('lodash');
let bcrypt = require('bcrypt-nodejs');

let User = require('./models/User');

module.exports = {
  settings: {
    name: 'profile',
    version: 1,
    namespace: 'profile',
    rest: true,
    ws: true,
    graphql: true,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: User
  },

  actions: {
    // return my profile with all properties
    getProfile: {
      cache: false, // can't be cached, because it is unique for every account
      async handler(ctx) {
        const userInfo = await this.getUser(ctx.user.code)
        return userInfo;
      }
    },

    updateUser: {
      permission: PERM_OWNER,
      async handler(ctx) {
        // ctx.assertModelIsExist(ctx.t('app:PostNotFound'));
        // this.validateParams(ctx, true);
        let params = ctx.params;
        const { profile } = params;

        return this.updateUser(profile);
      }
    },

    updatePassword: {
      handler(ctx) {
        //this.validateParams(ctx, true);
        const user = ctx.params;
        // console.log(user);
        return this.changePassword(ctx, user);
      }
    }
  },

  init(ctx) {
    this.persionService = ctx.services('persons');
    this.userSerivce = ctx.services('user');
  },

  methods: {
    validateParams(ctx, strictMode) {
      if (strictMode || ctx.hasParam('username'))
        ctx
          .validateParam('username')
          .trim()
          .notEmpty('UserName cannot be empty')
          .end();

      if (strictMode || ctx.hasParam('email'))
        ctx
          .validateParam('email')
          .trim()
          .notEmpty('Email cannot be empty')
          .end();

      if (ctx.hasValidationErrors())
        throw ctx.errorBadRequest(ERR_VALIDATION_ERROR, ctx.validationErrors);
    },

    getUser(code) {
      return User.findById(User.schema.methods.decodeID(code));
    },

    async updateUser(user) {
      const { code } = user;
      const _id = this.persionService.decodeID(code);
      let _user = await User.findOne({ _id });
      let existedUser = await User.findOne({ email: user.email });
      if (existedUser && existedUser.username != _user.username) {
        return { msgCnt: 'Email đã tồn tại', stsCd: 'E' };
      }

      if (_user) {
        Object.keys(user).forEach(k => {
          _user[k] = user[k];
        });

        const { referal_key } = user;
        if (referal_key) {
          const res = await this.userSerivce.createReferalKey({ user_id: _id, referal_key });
        }

        return _user.save().then(data => {
          return { msgCnt: 'Lưu Thành Công', stsCd: 'S' };
        });
      } else {
        return User.create(user).then(data => {
          return { msgCnt: 'Lưu Thành Công', stsCd: 'S' };
        });
      }
    },

    async changePassword(ctx, { oldPass, newPass }) {
      const userName = ctx.user.username; //Get user from session
      const user = await User.findOne({ username: userName });
      console.log('pass >>>', oldPass);
      console.log('user >>>', user);
      return new Promise((resolve, reject) => {
        user.comparePassword(oldPass, (err, isMatch) => {
          if (err) {
            resolve({ msgCnt: err, stsCd: 'E' });
          }
          if (isMatch) {
            user.password = newPass;
            resolve(user.save().then(data => { return { msgCnt: 'Cập Nhật Thành Công', stsCd: 'S' }; }));
          } else {
            resolve({ msgCnt: 'Mật Khẩu Cũ Không Khớp', stsCd: 'E' });
          }
        });
      });
    }
  },

  graphql: {
    query: `
      profile: Profile
      getProfile : Profile
    `,

    types: `
      type Profile {
        code: String!
        fullName: String
        email: String
        username: String
        passwordLess: Boolean
        provider: String
        profile: SocialProfile
        socialLinks: SocialLinks
        roles: [String]
        verified: Boolean
        apiKey: String
        locale: String
        avatar: String
        user_type: String
        createdAt: Timestamp
        updatedAt: Timestamp
        lastLogin: Timestamp
        status: Boolean
        phone: String
        referal_key: String
        api_key: String
      }
      type SocialProfile {
        name: String
        gender: String
        picture: String
        location: String
      }
      type SocialLinks {
        facebook: String
        twitter: String
        google: String
        github: String
      }
      input ProfileInput {
        code: String!
        fullName: String
        email: String
        phone: String
        referal_key: String
      }
      type ReturnData {
        stsCd : String
        msgCnt : String
      }
    `,

    mutation: `
      updateUser(profile: ProfileInput!): ReturnData
    `,

    resolvers: {
      Query: {
        profile: 'getProfile',
        getProfile: 'getProfile'
      },

      Mutation: {
        updateUser: 'updateUser'
      }
    }
  }
};
