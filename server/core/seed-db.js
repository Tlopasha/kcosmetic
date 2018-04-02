'use strict';

let logger = require('./logger');
let config = require('../config');
let C = require('./constants');
let { LAST_CHECK_DAY, MAX_TIMES_SEARCH } = require('./../biz/libs/constants');

let _ = require('lodash');
let tokgen = require('../libs/tokgen');
let fakerator = require('fakerator')();
const { code_generator } = require('../biz/libs/common');

let User = require('../models/User');
let CfgSeftDeclare = require('../biz/modules/cfg_selt_declare/models/cfg_seft_declare');
let CfgSeftDeclareDetail = require('../biz/modules/cfg_selt_declare/models/cfg_seft_declare_detail');
let CfgSetting = require('../biz/modules/cfg_setting/models/cfg_setting');
let ConfigCic = require('../biz/modules/cfg_cic/models/cfg_cic');
let Result = require('../biz/modules/result/models/result');


const UserSeed = () => {
  /**
   * Create default `admin` and `test` users
   */
  return User.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default Users to DB...');

      let users = [];

      let admin = new User({
        fullName: 'Administrator',
        email: 'admin@ltv.vn',
        username: 'admin',
        password: '123789',
        provider: 'local',
        // profile: {
        //   name: 'Administrator',
        //   gender: 'Male',
        //   phone: '+84901861929',
        // },
        phone: '841692098098',
        roles: [C.ROLE_ADMIN, C.ROLE_USER],
        verified: true,
        admin: true,
        publish: true,
        deleteFlag: false,
        activeFlag: true,
        user_type: 'admin',
      });
      users.push(admin.save());

      return Promise.all(users)
        .then(() => {
          logger.warn('Admin user was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('User Seeding done!');
  });
};

const SeftDeclareSeed = () => {
  return CfgSeftDeclare.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default CfgSeftDeclare to DB...');
  
      let declaries = [];
  
      let Q001 = new CfgSeftDeclare({
        option : 'Giới Tính',
        value : '',
        isFormToQuestion : false,
        option_code : 'Q001',
        orderNo : 1
      });
  
      let Q002 = new CfgSeftDeclare({
        option : 'Năm Sinh',
        value : '',
        isFormToQuestion : true,
        option_code : 'Q002',
        orderNo : 2
      });
  
      let Q003 = new CfgSeftDeclare({
        option : 'Đã lập gia đình',
        value : '',
        isFormToQuestion : false,
        option_code : 'Q003',
        orderNo : 3
      });
  
      let Q004 = new CfgSeftDeclare({
        option : 'Bao nhiêu con',
        value : '',
        isFormToQuestion : true,
        option_code : 'Q004',
        orderNo : 4
      });

      let Q005 = new CfgSeftDeclare({
        option : 'Có đi làm (có ghi tên cty)',
        value : '',
        isFormToQuestion : false,
        option_code : 'Q005',
        orderNo : 5
      });
  
      let Q006 = new CfgSeftDeclare({
        option : 'Thu nhập trung bình/tháng',
        value : '',
        isFormToQuestion : true,
        option_code : 'Q006',
        orderNo : 6
      });
  
      
  
      declaries.push(Q001.save());
      declaries.push(Q002.save());
      declaries.push(Q003.save());
      declaries.push(Q004.save());
      declaries.push(Q005.save());
      declaries.push(Q006.save());
  
      return Promise.all(declaries)
        .then(() => {
          logger.warn('CfgSeftDeclare user was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('CfgSeftDeclare Seeding done!');
  });
} 


const SeftDeclareDetailSeed = () => {
  return CfgSeftDeclareDetail.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default SeftDeclareDetailSeed to DB...');
  
      let declareDetails = [];
  
      let Q001_1 = new CfgSeftDeclareDetail({
        option_code : 'Q001',
        option_detail : 'Nam',
        option_range_from : 0,
        option_range_to : 0,
        option_score : -20,
        orderNo : 1
      });
      let Q001_2 = new CfgSeftDeclareDetail({
        option_code : 'Q001',
        option_detail : 'Nữ',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 50,
        orderNo : 2
      });
  
      declareDetails.push(Q001_1.save());
      declareDetails.push(Q001_2.save());

      let Q002_1 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 0,
        option_range_to : 18,
        option_score : -1000,
        orderNo : 1
      });
      let Q002_2 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 18,
        option_range_to : 20,
        option_score : -700,
        orderNo : 2
      });
      let Q002_3 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 20,
        option_range_to : 22,
        option_score : -500,
        orderNo : 3
      });
      let Q002_4 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 22,
        option_range_to : 24,
        option_score : -200,
        orderNo : 4
      });
      let Q002_5 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 24,
        option_range_to : 30,
        option_score : 50,
        orderNo : 5
      });
      let Q002_6 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 30,
        option_range_to : 36,
        option_score : 150,
        orderNo : 6
      });
      let Q002_7 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 36,
        option_range_to : 45,
        option_score : 180,
        orderNo : 7
      });
      let Q002_8 = new CfgSeftDeclareDetail({
        option_code : 'Q002',
        option_detail : '',
        option_range_from : 45,
        option_range_to : 100,
        option_score : 200,
        orderNo : 8
      });

      declareDetails.push(Q002_1.save());
      declareDetails.push(Q002_2.save());
      declareDetails.push(Q002_3.save());
      declareDetails.push(Q002_4.save());
      declareDetails.push(Q002_5.save());
      declareDetails.push(Q002_6.save());
      declareDetails.push(Q002_7.save());
      declareDetails.push(Q002_8.save());

      let Q003_1 = new CfgSeftDeclareDetail({
        option_code : 'Q003',
        option_detail : 'Có',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 100,
        orderNo : 2
      });
      let Q003_2 = new CfgSeftDeclareDetail({
        option_code : 'Q003',
        option_detail : 'Chưa',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 50,
        orderNo : 1
      });
      let Q003_3 = new CfgSeftDeclareDetail({
        option_code : 'Q003',
        option_detail : 'Ly Dị',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 60,
        orderNo : 3
      });

      declareDetails.push(Q003_1.save());
      declareDetails.push(Q003_2.save());
      declareDetails.push(Q003_3.save());

      let Q004_1 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 50,
        orderNo : 1
      });
      let Q004_2 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 0,
        option_range_to : 1,
        option_score : 80,
        orderNo : 2
      });
      let Q004_3 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 1,
        option_range_to : 2,
        option_score : 50,
        orderNo : 3
      });
      let Q004_4 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 2,
        option_range_to : 3,
        option_score : -30,
        orderNo : 4
      });
      let Q004_5 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 3,
        option_range_to : 4,
        option_score : -50,
        orderNo : 5
      });
      let Q004_6 = new CfgSeftDeclareDetail({
        option_code : 'Q004',
        option_detail : '',
        option_range_from : 4,
        option_range_to : 10,
        option_score : -200,
        orderNo : 6
      });

      declareDetails.push(Q004_1.save());
      declareDetails.push(Q004_2.save());
      declareDetails.push(Q004_3.save());
      declareDetails.push(Q004_4.save());
      declareDetails.push(Q004_5.save());
      declareDetails.push(Q004_6.save());

      let Q005_1 = new CfgSeftDeclareDetail({
        option_code : 'Q005',
        option_detail : 'Có',
        option_range_from : 0,
        option_range_to : 0,
        option_score : 100,
        orderNo : 1
      });
      let Q005_2 = new CfgSeftDeclareDetail({
        option_code : 'Q005',
        option_detail : 'Không (FreeLancer)',
        option_range_from : 0,
        option_range_to : 0,
        option_score : -100,
        orderNo : 2
      });

      declareDetails.push(Q005_1.save());
      declareDetails.push(Q005_2.save());

      let Q006_1 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 0,
        option_range_to : 0,
        option_score : -1000,
        orderNo : 1
      });
      let Q006_2 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 0,
        option_range_to : 1,
        option_score : -800,
        orderNo : 2
      });
      let Q006_3 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 1,
        option_range_to : 2,
        option_score : -700,
        orderNo : 3
      });
      let Q006_4 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 2,
        option_range_to : 3,
        option_score : -150,
        orderNo : 4
      });
      let Q006_5 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 3,
        option_range_to : 4,
        option_score : -100,
        orderNo : 5
      });
      let Q006_6 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 4,
        option_range_to : 5,
        option_score : 0,
        orderNo : 6
      });
      let Q006_7 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 5,
        option_range_to : 6,
        option_score : 60,
        orderNo : 7
      });
      let Q006_8 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 6,
        option_range_to : 7,
        option_score : 80,
        orderNo : 8
      });
      let Q006_9 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 7,
        option_range_to : 8,
        option_score : 100,
        orderNo : 9
      });
      let Q006_10 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 8,
        option_range_to : 9,
        option_score : 120,
        orderNo : 10
      });
      let Q006_11 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 9,
        option_range_to : 10,
        option_score : 150,
        orderNo : 11
      });
      let Q006_12 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 10,
        option_range_to : 12,
        option_score : 200,
        orderNo : 12
      });
      let Q006_13 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 12,
        option_range_to : 15,
        option_score : 250,
        orderNo : 13
      });
      let Q006_14 = new CfgSeftDeclareDetail({
        option_code : 'Q006',
        option_detail : '',
        option_range_from : 15,
        option_range_to : 500,
        option_score : 300,
        orderNo : 14
      });
      declareDetails.push(Q006_1.save());
      declareDetails.push(Q006_2.save());
      declareDetails.push(Q006_3.save());
      declareDetails.push(Q006_4.save());
      declareDetails.push(Q006_5.save());
      declareDetails.push(Q006_6.save());
      declareDetails.push(Q006_7.save());
      declareDetails.push(Q006_8.save());
      declareDetails.push(Q006_9.save());
      declareDetails.push(Q006_10.save());
      declareDetails.push(Q006_11.save());
      declareDetails.push(Q006_12.save());
      declareDetails.push(Q006_13.save());
      declareDetails.push(Q006_14.save());
  
      return Promise.all(declareDetails)
        .then(() => {
          logger.warn('CfgSeftDeclareDetail user was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('CfgSeftDeclareDetail Seeding done!');
  });
} 


const CfgSettingSeed = () => {

  return CfgSetting.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default CfgSettingSeed to DB...');

      let cfgsetting = [];

      let data1 = new CfgSetting({
        cfg_cd : LAST_CHECK_DAY,
        cfg_vl : '30'
      });

      let data2 = new CfgSetting({
        cfg_cd : MAX_TIMES_SEARCH,
        cfg_vl : '2'
      });

      cfgsetting.push(data1.save());
      cfgsetting.push(data2.save());

      return Promise.all(cfgsetting)
        .then(() => {
          logger.warn('CfgSettingSeed was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('CfgSetting Seeding done!');
  });
};

const ConfigCicSeed = () => {

  return ConfigCic.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default ConfigCicSeed to DB...');

      let configcic = [];

      let data1 = new ConfigCic({
        cib_msg: 'Không có dữ liệu nào thỏa điều kiện tìm kiếm',
        cic_sys_rslt: 'Không có thông tin',
        cic_result: 'Hồ sơ pass bước kiểm tra CIB ',
        point: 670,
        random_point : 10
      });

      let data2 = new ConfigCic({
        cib_msg: 'Khách hàng hiện không có quan hệ tại TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
        cic_sys_rslt: 'CIC đáo hạn',
        cic_result: 'Hồ sơ pass bước kiểm tra CIB',
        point: 650,
        random_point : 10
      });

      let data3 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 1 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
        cic_sys_rslt: 'Nợ tiêu chuẩn',
        cic_result: 'Hồ sơ pass bước kiểm tra CIB',
        point: 600,
        random_point : 10
      });

      let data4 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 2 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
        cic_sys_rslt: 'Nợ tiêu chuẩn',
        cic_result: 'Hồ sơ pass bước kiểm tra CIB',
        point: 560,
        random_point : 10
      });

      let data5 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 3 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
        cic_sys_rslt: 'Nợ tiêu chuẩn',
        cic_result: 'Hồ sơ bị từ chối',
        point: 500,
        random_point : 10
      });

      let data6 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 4 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/12/2017',
        cic_sys_rslt: 'Nợ tiêu chuẩn',
        cic_result: 'Hồ sơ bị từ chối',
        point: 450,
        random_point : 10
      });

      let data7 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 5 TCTD, không có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/11/2017',
        cic_sys_rslt: 'Đang có quan hệ với 5 tổ chức tín dụng trở lên',
        cic_result: 'Hồ sơ bị từ chối',
        point: 400,
        random_point : 10
      });

      let data8 = new ConfigCic({
        cib_msg: 'Khách hàng hiện đang quan hệ tại 2 TCTD, có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/12/2017',
        cic_sys_rslt: 'Đang có nợ nhóm 2',
        cic_result: 'Hồ sơ bị từ chối',
        point: 400,
        random_point : 10
      });

      let data9 = new ConfigCic({
        cib_msg: 'Khách hàng hiện không có quan hệ tại TCTD, có nợ cần chú ý và không có nợ xấu tại thời điểm cuối tháng 30/12/2017',
        cic_sys_rslt: 'Đang có nợ nhóm 2',
        cic_result: 'Hồ sơ bị từ chối',
        point: 400,
        random_point : 10
      });

      let data10 = new ConfigCic({
        cib_msg: 'Khách hàng thuộc đối tượng cảnh báo CB1 tính đến ngày 30/09/2017',
        cic_sys_rslt: 'Đang có nợ xấu',
        cic_result: 'Hồ sơ bị từ chối',
        point: 350,
        random_point : 10
      });

      let data11 = new ConfigCic({
        cib_msg: 'Khách hàng thuộc đối tượng cảnh báo CB2 tính đến ngày 30/09/2017',
        cic_sys_rslt: 'Đang có nợ xấu',
        cic_result: 'Hồ sơ bị từ chối',
        point: 300,
        random_point : 10
      });

      let data12 = new ConfigCic({
        cib_msg: 'Khách hàng thuộc đối tượng cảnh báo CB3 tính đến ngày 30/09/2017',
        cic_sys_rslt: 'Đang có nợ xấu',
        cic_result: 'Hồ sơ bị từ chối',
        point: 250,
        random_point : 10
      });


      configcic.push(data1.save());
      configcic.push(data2.save());
      configcic.push(data3.save());
      configcic.push(data4.save());
      configcic.push(data5.save());
      configcic.push(data6.save());
      configcic.push(data7.save());
      configcic.push(data8.save());
      configcic.push(data9.save());
      configcic.push(data10.save());
      configcic.push(data11.save());
      configcic.push(data12.save());

      return Promise.all(configcic)
        .then(() => {
          logger.warn('ConfigCicSeed was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('ConfigCicSeed Seeding done!');
  });
};

const ResultSeed = () => {

  return Result.find({}).exec().then((docs) => {
    if (docs.length === 0) {
      logger.warn('Load default Result to DB...');

      let result = [];

      let data1 = new Result({
        isAccept : true,
        point_from : 720,
        point_to : 100000,
        loan : '25-50',
        duration : '30',
        interest_rate : '48',
      });

      let data2 = new Result({
        isAccept : true,
        point_from : 700,
        point_to : 720,
        loan : '25-40',
        duration : '35',
        interest_rate : '48',
      });

      let data3 = new Result({
        isAccept : true,
        point_from : 650,
        point_to : 720,
        loan : '25-40',
        duration : '40',
        interest_rate : '48',
      });

      let data4 = new Result({
        isAccept : true,
        point_from : 600,
        point_to : 650,
        loan : '25-40',
        duration : '43',
        interest_rate : '36',
      });

      let data5 = new Result({
        isAccept : true,
        point_from : 550,
        point_to : 650,
        loan : '25-30',
        duration : '45',
        interest_rate : '36',
      });

      result.push(data1.save());
      result.push(data2.save());
      result.push(data3.save());
      result.push(data4.save());
      result.push(data5.save());

      return Promise.all(result)
        .then(() => {
          logger.warn('Result Seed was created!');
        });
    }
  }).catch((err) => {
    logger.error(err);
  }).then(() => {
    return require('../biz/libs/seed-db')();
  }).then(() => {
    logger.debug('Result Seeding done!');
  });
};


module.exports = {
  UserSeed,
  SeftDeclareSeed,
  SeftDeclareDetailSeed,
  CfgSettingSeed,
  ConfigCicSeed,
  ResultSeed
}
