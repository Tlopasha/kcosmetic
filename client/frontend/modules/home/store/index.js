import {
  GET_DATAS,
  FULLLOADING,
  TIME,
  VISABLERESULT,
  VISABLEDEPTH,
  FILL_RESULT,
  IS_RESCORED,
  SHOW_DEPTH_POINT,
  UPDATE_CURRENCY,
  PROGRESS_NO,
  UPDATE_SELECTED_COMPANY,
  SET_DEFAULT_VALUE,
  IS_DENIED
} from './types';
import { each, find, assign, remove, isArray } from 'lodash';


const state = {
  lstDeclare: [],
  lstDeclareDefault: {
    name: '',
    wantMuch: '',
    phone: '',
    email: '',
    company: '',
  },
  fullloading: false,
  time: {
    second: '00'
  },
  progressNo : 0,

  visableResult: false,
  visableDepth: false,

  dataResult: {
    score: '',
    cic_point: '',
    loan: '',
    interest_rate: '',
    duration: '',
    agreeCopany: []
  },
  isRescored: false,
  isDenied:false,
  showDepthPoint: false,
  selectedCompany: [],
};

const mutations = {
  [GET_DATAS](state, response) {
    state.lstDeclare.splice(0);
    state.lstDeclare.push(...response.data);
  },

  [FILL_RESULT](state, data) {
    state.dataResult = data;
  },

  [FULLLOADING](state, flag) {
    state.fullloading = flag;
  },

  [VISABLERESULT](state, flag) {
    state.visableResult = flag;
  },

  [VISABLEDEPTH](state, flag) {
    state.visableDepth = flag;
  },

  [IS_RESCORED](state, flag) {
    state.isRescored = flag;
  },

  [IS_DENIED](state, flag) {
    state.isDenied = flag;
  },
  
  [SHOW_DEPTH_POINT](state, flag) {
    state.showDepthPoint = flag;
  },

  [TIME](state, time) {
    state.time = time;
  },

  [PROGRESS_NO](state, num) {
    state.progressNo = num;
  },

  [UPDATE_CURRENCY](state, data) {
    for (let i = 0; i < state.lstDeclare.length; i++) {
      let item = state.lstDeclare[i]
      if (item.option_code === data.code) {
        item.value = data.value
        break;
      }
    }
  },

  [UPDATE_SELECTED_COMPANY](state, data) {
    state.selectedCompany = data;
  },

  [SET_DEFAULT_VALUE](state, data) {
    state.dataResult=  {
      score: '',
      cic_point: '',
      loan: '',
      interest_rate: '',
      duration: '',
      agreeCopany: []
    };

    state.lstDeclareDefault = {
      name: '',
      wantMuch: '',
      phone: '',
      email: '',
      company: '',
    }
    state.visableDepth = false;
    state.visableResult = false;
    state.isRescored = false;
    state.showDepthPoint = false;
    state.isDenied = false;
  },

  
  
};

import * as getters from './getters';
import * as actions from './actions';
import { UPDATE_DATA } from '../../../../app/modules/setting/store/types';
import { saveCicCfg } from '../../../../app/modules/cfgcic/store/actions';

export default {
  strict: false,
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
