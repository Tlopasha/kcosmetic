import _ from 'lodash';
import { GET_PROFILE_INFO, UPDATE_PROFILE } from './types';

let state = {
  profileData: {
    profile: {}
  }
};

const mutations = {
  [GET_PROFILE_INFO](state, profile) {
    state.profileData = { ...profile };
  },

  [UPDATE_PROFILE](state, profile) {
    let profileData = _.cloneDeep(state.profileData);
    profileData = _.merge(profileData, profile);
    state.profileData = { ...profileData };
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
