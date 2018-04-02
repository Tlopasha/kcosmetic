import { GET_DATAS, GET_ALL_DATAS, REMOVE, SET_DIALOG, UPDATE_LIST} from './types';
import { each, find, assign, remove, isArray } from 'lodash';


const state = {
  lstDeclare: [],
  lstAllDeclare: [],
  total :0,
  dialog: false,
};

const mutations = {
  [GET_DATAS](state, response) {
    state.lstDeclare.splice(0);
    state.lstDeclare.push(...response.data);
    state.total = response.total;
  },

  [GET_ALL_DATAS](state, response) {
    state.lstAllDeclare.splice(0);
    state.lstAllDeclare.push(...response.data);
  },


  [UPDATE_LIST](state, data) {
    let lstDeclareData = _.cloneDeep(state.lstDeclare);
    lstDeclareData = _.merge(lstDeclareData, data);
    state.lstDeclare = { ...lstDeclareData };
  },

  [SET_DIALOG](state, flag) {
    state.dialog = flag;
  },

  [REMOVE](state, model) {
    state.lstDeclare = state.lstDeclare.filter(item => item._id != model._id);
    state.total -= 1;
  }
};

import * as getters from './getters';
import * as actions from './actions';

export default {
  strict : false,
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
