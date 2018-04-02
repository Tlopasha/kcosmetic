import { GET_USERS,REMOVE ,SET_DIALOG} from './types';
import { each, find, assign, remove, isArray } from 'lodash';


const state = {
  usersLs: [],
  roles: [{value: 'admin',label: 'Admin'}, {value: 'user',label: 'Partner'}],
  total :0,
  dialog: false,
};

const mutations = {
  [GET_USERS](state, response) {
    state.usersLs.splice(0);
    state.usersLs.push(...response.data);
    state.total = response.total;
  },

  [SET_DIALOG](state, flag) {
    state.dialog = flag;
  },

  [REMOVE](state, model) {
    state.usersLs = state.usersLs.filter(item => item._id != model._id);
    state.total -= 1;
  }
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
