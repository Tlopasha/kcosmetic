import {
  GET_MONTHLY_CHART_DATA,
  GET_DAILY_CHART_DATA,
  GET_REFERALS,
  GET_BIG_CHART_DATA,
  GET_STATS,
  GET_LOGS
} from './types';

const state = {
  bigChartDatas: {
    datas: [],
    labels: [],
  },
  monthlyChartDatas: {
    datas: [],
    labels: [],
  },
  dailyChartDatas: {
    datas: [],
    labels: [],
  },
  referels: [],
  logInfos: [],
  total: 0
};

const mutations = {
  [GET_STATS](state, data) {

    state.statsCount = { ...data };
  },
  [GET_MONTHLY_CHART_DATA](state, data) {
    state.monthlyChartDatas = { ...data };
  },
  [GET_DAILY_CHART_DATA](state, data) {
    state.dailyChartDatas = { ...data };
  },

  [GET_BIG_CHART_DATA](state, data) {
    state.bigChartDatas = { ...data };
  },

  [GET_REFERALS](state, data) {
    state.referels.splice(0);
    state.referels.push(...data);
  },

  [GET_LOGS](state, response) {
    state.logInfos.splice(0);
    state.logInfos.push(...response.data);
    state.total = response.total;    
  },

  


};

import * as getters from './getters';
import * as actions from './actions';

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
