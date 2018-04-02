import { GET_DATA, UPDATE_DATA} from './types';
import { each, find, assign, remove, isArray } from 'lodash';
import _ from 'lodash';

const state = {
  total :0,
  dialog: false,
  dataSetting: {
    LAST_CHECK_DAY: '',
    MAX_TIMES_SEARCH: '',
  },
};

const mutations = {
  [GET_DATA](state, data) {
    state.dataSetting = data;
  },

  [UPDATE_DATA](state, data) {
    let setting = _.cloneDeep(state.dataSetting);
    setting = _.merge(setting, data);
    state.dataSetting = { ...setting };
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
