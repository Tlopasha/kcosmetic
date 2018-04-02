
'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Dbdn = require('./models/dbdn');

const multer = require('multer');
const mime = require('mime');
const { ObjectId } = mongoose.Types;
const { PERM_LOGGEDIN, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const moment = require('moment');

const { mkdirSync } = require('../../libs/common');
const ExcelReader = require('../../libs/excel-reader');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const fileWithoutExt = `${moment().format('DDMMYYYY')}`
    mkdirSync(`./uploads/${fileWithoutExt}`);
    file.originalname = `${fileWithoutExt}${Date.now()}.${mime.getExtension(file.mimetype)}`;
    cb(null, `./uploads/${fileWithoutExt}/`);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploader = multer({ storage });

module.exports = {
  settings: {
    name: 'dbdn',
    version: 1,
    namespace: 'dbdn',
    rest: true,
    ws: true,
    graphql: false,
    permission: PERM_LOGGEDIN,
    role: 'user',
    collection: Dbdn,
  },

  actions: {
    getData: {
      cache: false,
      handler(ctx) {
        const { searchText, size, skip } = ctx.params;
        const user = ctx.user;
        return this.getData(ctx, {
          page: {
            size,
            skip,
          },
          searchText: searchText
        }, user);
      }
    },

    import: {
      middlewares: [uploader.single('file')],
      async handler(ctx) {
        
        const file = ctx.req.file;
        const isWriteOver = ctx.params.isWriteOver;
        const eR = new ExcelReader(file.path);

        const result = await eR.read().toDB(mongoose.connection, isWriteOver);

        return { msgCode: 'success', msgContent: 'Import Thành Công', msgTitle: 'Thông Báo' };
      }
    },

  },

  methods: {
  
    async getData(ctx, params, user) {
      let condition = {
        $or: [
          { name: { $regex: `.*${params.searchText || ''}.*` } },
          { address: { $regex: `.*${params.searchText || ''}.*` } }
        ]
      };
     
      const { skip, size } = params.page;
      let [total, data] = await Promise.all([
        Dbdn.count(condition),
        Dbdn.find(condition).skip(skip).limit(size),
      ]);

      return { total, data };
    },
  },

  init(ctx) {
  },
};
