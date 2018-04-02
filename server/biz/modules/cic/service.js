'use strict';
const _ = require('lodash');
const moment = require('moment');

const logger = require('../../../core/logger');
const config = require('../../../config');
const mailer = require('../../libs/mailer');

const { cicGetInfoByCmt } = require('../../libs/cic');
const { PERM_PUBLIC, ERR_VALIDATION_ERROR } = require('../../../core/constants');
const { LAST_CHECK_DAY, MAX_TIMES_SEARCH } = require('../../libs/constants');
const { randomIntFromInterval } = require('../../libs/common');


const CfgCic = require('./../cfg_cic/models/cfg_cic');
const Result = require('./../result/models/result');
const CfgSeftDeclare = require('./../cfg_selt_declare/models/cfg_seft_declare');
const CfgSeftDeclareDetail = require('./../cfg_selt_declare/models/cfg_seft_declare_detail');

const PhoneCheck = require('./../phone_check/models/phone_check');
const CheckLog = require('./../phone_check/models/check_log');
const Cfgsetting = require('./../cfg_setting/models/cfg_setting');
const verifyCodeCollection = require('./../smsAPI/models/verify_code');
const User = require('./../user/models/User');

const exampleCicReturn = {
  //Not allow
  //info: 'Khách hàng hiện đang quan hệ tại 3 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
  //Allow
  info: 'Khách hàng hiện không có quan hệ tại TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017'
}

const typeShorts = [
  'PR', 'PD', 'A&L',
  'ED', 'DD', '"IA" D',
  'PD',
  'TAL', 'BSA', 'ESA'
];

const companyAgree = [{
  id: '1',
  src: 'https://unsplash.it/200?random',
  alt: 'Alt Image 1'
}, {
  id: '2',
  src: 'https://unsplash.it/200?random',
  alt: 'Alt Image 2'
}, {
  id: '3',
  src: 'https://unsplash.it/200?random',
  alt: 'Alt Image 3'
},{
  id: '4',
  src: 'https://unsplash.it/200?random',
  alt: 'Alt Image 2'
}, {
  id: '5',
  src: 'https://unsplash.it/200?random',
  alt: 'Alt Image 3'
}]
const NAMEJET = 'Namejet';
const SNAPNAMES = 'Snapnames';
const DROPCATCH = 'Dropcatch';
const GODADDY = 'Godaddy';

const DOWNLOAD_SOURCES = [NAMEJET, SNAPNAMES, DROPCATCH, GODADDY];

module.exports = {
  settings: {
    name: 'cic',
    version: 1,
    namespace: 'cic',
    rest: true,
    ws: true,
    graphql: true,
    permission: PERM_PUBLIC,
    role: 'GUEST',
  },

  actions: {
    checkCic: {
      async handler(ctx) {
        const { id, verifyCode, ref } = ctx.params;
        return this.getCICInfo(id, verifyCode, ref);
      }
    },

    depthRescore: {
      async handler(ctx) {
        return this.recordByInfoProvided(ctx.params);
      }
    },

    sendFinalResult: {
      async handler(ctx) {
        return this.sendFinalResult(ctx.params);
      }
    }
  },

  methods: {
    validateParams(ctx, strictMode) {
      if (strictMode || ctx.hasParam('id'))
        ctx.validateParam('id').trim().notEmpty('Vui lòng cung cấp số chứng minh nhân dân').end();

      if (ctx.hasValidationErrors())
        throw ctx.errorBadRequest(ERR_VALIDATION_ERROR, ctx.validationErrors);
    },

    async getCICInfo(cmt, verifyCode, referal_key) {

      //Kiểm Tra verify Code ==============================
      let checkingVO = await verifyCodeCollection.findOne({ 'cmnd': cmt, 'isChecked': false, 'code': verifyCode });
      if (!checkingVO) {
        console.log('catch : Wrong Verify Code');
        return { msgCd: 'E', msgCnt: 'verify code không đúng' };
      } else {
        //Update lại cờ
        await verifyCodeCollection.updateMany({ 'cmnd': cmt }, {
          $set: {
            isChecked: true
          }
        });
      }
      //Kiểm Tra verify Code ==============================

      let currentDateStr = moment().format('YYYYMMDDHHmmss');

      //Get setting Max checking time, Last checking time
      let settingList = await Cfgsetting.find({ cfg_cd: { $in: [LAST_CHECK_DAY, MAX_TIMES_SEARCH] } });
      let setting = {};
      if (settingList) {
        settingList.forEach(c => {
          setting[c.cfg_cd] = c.cfg_vl;
        })
      }

      //Check Max SDT, CMND
      const checkCounterPhoneCMND = await PhoneCheck.findOne({ 'identity_number': cmt, 'phone_number': checkingVO.phone }, { check_counter: 1 });
      if (checkCounterPhoneCMND) {
        //Checking agaim => Khong tính counter
        console.log('Phone and ID is the same, checking again');
      } else {
        const checkCounter = await PhoneCheck.findOne({ 'phone_number': checkingVO.phone }, { check_counter: 1 });
        if (checkCounter && (parseInt(checkCounter.check_counter) >= parseInt(setting.MAX_TIMES_SEARCH))) {
          console.log('catch : check_counter > MAX_TIMES_SEARCH');
          return { msgCd: 'E', msgCnt: 'Quý khách vui lòng liên hệ với trung tâm Tư Vấn' };
        }
      }



      //Kiem tra xem da check CIC lan nao chưa ?
      let pCheck = await PhoneCheck.findOne({ 'identity_number': cmt }, {}, { sort: { 'createdAt': 1 } }); //'phone_number': checkingVO.phone

      let info = {};

      //Check Rồi thì Kiểm tra check bao nhiêu lần, check lâu chưa
      if (pCheck) { //Get trong DB hoặc request mới
        // Vi currentDateStr, last_check_time format YYYYMMDDHHmmss 
        let lastesCheckDay = parseInt(currentDateStr.substr(0, 8)) - parseInt(pCheck.last_check_time.substr(0, 8))
        if (lastesCheckDay > setting.LAST_CHECK_DAY) {
          logger.info('CIC info >>> Request');
          //Window
          //info = exampleCicReturn;
          //Mac
          info = await cicGetInfoByCmt(cmt);
        } else {
          //get data from DB
          logger.info('CIC info >>> Get From DB');
          let checkLogdata = await CheckLog.findOne({ 'phone_id': pCheck._id, 'check_time': pCheck.last_check_time });
          info = { info: checkLogdata.cid_result }
        }

      } else { //Request Mới
        logger.info('CIC info >>> Request');
        //Window
        //info = exampleCicReturn;
        //Mac
        info = await cicGetInfoByCmt(cmt);
      }

      logger.info('CIC info', info);
      logger.info('CIC info >>> Completed');
      //logger.info(pCheck);

      let cicRecord = {};
      let result = {
        cic_point: '',
        score: '',
        loan: '',
        interest_rate: '',
        duration: ''
      }
      //Compare msg and calculate point
      let randomNum = 0;
      let score = 0;
      if (!info) {
        //Send mail to admin
        console.log('catch : Info CIC không có');
        return { msgCd: 'E', msgCnt: 'Hệ thống đang bận ! Xin quý khách vui lòng liên hệ với trung tâm Tư Vấn' };
      } else {
        let textInfo = info.info;
        textInfo = textInfo.substr(0, textInfo.length - 10); //DD/MM/YYYY
        cicRecord = await CfgCic.findOne({ 'cib_msg': { $regex: `${textInfo}.*` } });
        if (!cicRecord) {
          console.log('catch : Không tìm thấy kết quả trong cic config >> send mail toi admin');
          return { msgCd: 'E', msgCnt: 'Không có kết quả cfgcic' }
        } else {
          //Tính score
          let randomPoint = cicRecord.random_point;
          randomNum = randomIntFromInterval(0 - randomPoint, randomPoint);
          if (randomNum == -10 || randomNum == 10 || randomNum == 0)
            randomNum += 1;
          score = cicRecord.point + randomNum;
        }
      }

      //Insert into Phone Check
      let phoneCheckObj;
      let pcExistByPhone = await PhoneCheck.findOne({ 'phone_number': checkingVO.phone }, {}, { sort: { 'createdAt': 1 } });
      console.log('pcExistByPhone >>>>>>>>>>>>>>>>>', pcExistByPhone);
      if (pcExistByPhone) {
        phoneCheckObj = await PhoneCheck.findOne({ 'identity_number': cmt, 'phone_number': checkingVO.phone });


        if (phoneCheckObj) {
          console.log('Update last_check_time chinhs no >>>>>>>>>>>>>>>>>');
          //Update last_check_time
          await PhoneCheck.findOneAndUpdate({ '_id': phoneCheckObj._id }, {
            $set: {
              last_check_time: currentDateStr
            }
          });
        } else {
          //Insert
          phoneCheckObj = await PhoneCheck.create({
            search_time: currentDateStr,
            identity_number: cmt,
            phone_number: checkingVO.phone,
            check_counter: 1,
            last_check_time: currentDateStr
          });
          //Update check_counter by Phone
          await PhoneCheck.updateMany({ 'phone_number': checkingVO.phone }, {
            $set: { check_counter: (parseInt(pcExistByPhone.check_counter) + 1) }
          });
          console.log('Inssert 1-A va update counter >>>>>>>>>>>>>>>>>', parseInt(pcExistByPhone.check_counter) + 1);
        }
      } else {
        //Insert
        phoneCheckObj = await PhoneCheck.create({
          search_time: currentDateStr,
          identity_number: cmt,
          phone_number: checkingVO.phone,
          check_counter: 1,
          last_check_time: currentDateStr
        });
      }


      let resultVO = {};
      if (score)
        resultVO = await Result.findOne({ '$and': [{ 'point_from': { $lte: score } }, { 'point_to': { $gt: score } }] })

      const res = await this.userService.increaseReferalCount({ 'referal_key' : referal_key });
      if (resultVO) {
        //Data for client
        result.cic_point = score;
        result.score = 0;
        result.loan = resultVO.loan;
        result.duration = resultVO.duration;
        result.interest_rate = resultVO.interest_rate;
        result.phone_id = phoneCheckObj._id;
        result.check_time = currentDateStr;
        result.agree_company =  [];

        //Insert into CheckLogs
        await CheckLog.create({
          phone_id: phoneCheckObj._id,
          check_time: currentDateStr,
          cid_result: info.info,
          cib_point: cicRecord.point,
          cib_random_point: randomNum,
          referal_key : referal_key
        });
        return { msgCd: 'S', msgCnt: 'Thành Công', data: result };
      } else {
        //Data for client
        result.cic_point = score;
        result.score = 0;
        result.loan = '';
        result.duration = '';
        result.interest_rate = '';
        result.phone_id = phoneCheckObj._id;
        result.check_time = currentDateStr;
        result.agree_company =  [];
        
        //Insert into CheckLogs
        await CheckLog.create({
          phone_id: phoneCheckObj._id,
          check_time: currentDateStr,
          cid_result: info.info,
          cib_point: cicRecord.point,
          cib_random_point: randomNum,
          referal_key : referal_key
        });

        return { msgCd: 'E', msgCnt: 'Hồ sơ của bạn bì từ chối', data: result };
      }
    },

    async recordByInfoProvided(params) {

      const { dynamicForm, requiredForm, cicForm, cicResult } = params;

      let CV = [];


      Object.keys(requiredForm).forEach(function (key) {

        let labelQuesion = 'Công Ty'; //company
        if (key === 'name')
          labelQuesion = 'Họ Tên'
        if (key === 'wantMuch')
          labelQuesion = 'Khoảng Muốn Vay'
        if (key === 'phone')
          labelQuesion = 'SĐT'
        if (key === 'email')
          labelQuesion = 'Email'

        let CVitem = {
          questionId: '',
          point: 0,
          question: labelQuesion,
          answer: requiredForm[key]
        }
        CV.push(CVitem);

      });

      let point = 0;
      for (let question of dynamicForm) {
        delete question.declaredetails;

        //Năm Sinh => 1993
        if (question.option_code === 'Q002') {
          if (question.value.length > 2) {
            let currentYear = (new Date()).getFullYear();
            question.value = currentYear - parseInt(question.value);
          }
        }

        //Q006 Thu Nhap Binh Quan 15 or 15000000
        if (question.option_code === 'Q006') {
          if(question.value){
            if(question.value.indexOf('.') != -1){
              question.value = question.value.replace(/\./g, '');
              question.value = parseInt(question.value) / 1000000;
            }
          }
        }

        //Select from to
        let cfgSeftDeclareDetailVO;
        if (question.isFormToQuestion) {
          if (question.value) {
            question.value = parseInt(question.value);
            cfgSeftDeclareDetailVO = await CfgSeftDeclareDetail.findOne({
              '$and': [{ 'option_range_from': { $lte: question.value } },
              { 'option_range_to': { $gt: question.value } },
              { 'option_code': question.option_code }
              ]
            }, { option_score: 1 })
          }
        } else {
          if (question.value) {
            cfgSeftDeclareDetailVO = await CfgSeftDeclareDetail.findOne({
              '$and': [{ 'option_detail': question.value },
              { 'option_code': question.option_code }
              ]
            }, { option_score: 1 })
          }
        }

        console.log('---------------------------------->>>')
        console.log('cau hoi', question.option);
        console.log('tra loi', question.value);
        console.log('code', question.option_code);

        let CVitem = {
          questionId: question.option_code,
          point: cfgSeftDeclareDetailVO ? cfgSeftDeclareDetailVO.option_score : 0,
          question: question.option,
          answer: question.value
        }
        CV.push(CVitem);

        if (cfgSeftDeclareDetailVO) {
          point += cfgSeftDeclareDetailVO.option_score;
          console.log('DIEM', cfgSeftDeclareDetailVO.option_score);
        } else {
          console.log('DIEM', null);
        }
        console.log('----------------------------------<<<')

      }

      if (point != 0)
        point = Math.floor(point / 10);

      let finalScore = cicResult.cic_point - 50 + point;

      console.log('diem tu khai : ', point);
      console.log('diem CIC : ', cicResult.cic_point);
      console.log('CIC -50 + TỰ KHAI : ', finalScore);

      let result = {
        score: '',
        loan: '',
        interest_rate: '',
        duration: ''
      }

      //Insert DB
      await CheckLog.findOneAndUpdate({ phone_id: cicResult.phone_id, check_time: cicResult.check_time }, {
        $set: {
          final_score: finalScore,
          self_declare_info: CV
        }
      }, { upsert: true })


      let resultVO;
      if (finalScore)
        resultVO = await Result.findOne({ '$and': [{ 'point_from': { $lte: finalScore } }, { 'point_to': { $gt: finalScore } }] })

      if (resultVO) {

        //Select parnter;
        let partnerLst = await User.find({'disableFlg': false, 'user_type': 'user'})
        let agreeCompanies = []
        partnerLst.forEach(element => {
          let item = {
            id: element.username,
            src: element.logo_url,
            alt: element.fullName,
            phone: element.phone,
            email: element.email,
          }
          agreeCompanies.push(item);
        });

        result.cic_point = cicResult.cic_point;
        result.score = finalScore;
        result.loan = resultVO.loan;
        result.duration = resultVO.duration;
        result.interest_rate = resultVO.interest_rate;
        result.phone_id = cicResult.phone_id;
        result.check_time = cicResult.check_time;
        result.agree_company = agreeCompanies;
        

        return { msgCd: 'S', msgCnt: '', data: result };
      } else {
        //Hồ sơ bị từ chối
        result.cic_point = cicResult.cic_point;
        result.score = finalScore;
        result.loan = '';
        result.duration = '';
        result.interest_rate = '';
        result.phone_id = cicResult.phone_id;
        result.check_time = cicResult.check_time;
        result.agree_company =  [];

        return { msgCd: 'E', msgCnt: 'Hồ sơ của bạn bì từ chối', data: result };
      }
    },

    async sendFinalResult(params) {
      const today = moment().format('YYYY-MM-DD');
      const { cicResult, selectedCompany } = params;

      let checkLogVO = await CheckLog.findOne({ phone_id: cicResult.phone_id, check_time: cicResult.check_time })

      await CheckLog.findOneAndUpdate({ phone_id: cicResult.phone_id, check_time: cicResult.check_time }, {
        $set: {
          status: 'sent'
        }
      }, { upsert: true })

      for(let i = 0; i < selectedCompany.length; i++){
        let companyAgree = selectedCompany[i];
        //sent mail
        await mailer.sendHTML(
          {
            to: companyAgree.email,
            template: 'demo-emails',
            data: {
              name: companyAgree.alt,
              today,
              selfdeclareinfo : checkLogVO.self_declare_info
            }
          }
        );
      }

      return true;
    },
  },

  init(ctx) {
    this.userService = ctx.services('user');
  }
}
