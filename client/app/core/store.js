import Vue from 'vue';
import Vuex from 'vuex';

import session from '../modules/session/store';
import dashboard from '../modules/dashboard/store';
import profile from '../modules/profile/store';
import user from '../modules/user/store';
import cfgcic from '../modules/cfgcic/store';
import cfgselfdeclare from '../modules/cfgselfdeclare/store';
import dbdn from '../modules/dbdn/store';
import result from '../modules/result/store';
import setting from '../modules/setting/store';
import phonecheck from '../modules/phonecheck/store';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    session,
    dashboard,
    profile,
    user,
    cfgcic,
    cfgselfdeclare,
    dbdn,
    result,
    setting,
    phonecheck
  },
  strict: process.env.NODE_ENV !== 'production'
});
