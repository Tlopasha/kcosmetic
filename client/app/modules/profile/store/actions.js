import Vue from 'vue';

import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import GetProfile from '../graphql/GetProfile.gql';
import QueryProfile from '../graphql/QueryProfile.gql';
import UpdateProfile from '../graphql/UpdateProfile.gql';
import { GET_PROFILE_INFO, UPDATE_PROFILE } from './types';

const service = new Service('profile');
const NAMESPACE = '/api/profile';


export const getProfile = ({ commit, state }) => {
  service
    .query(QueryProfile)
    .then(data => {
      commit('GET_PROFILE_INFO', data.getProfile);
    })
    .catch(err => {
      toastr.error(err.message);
    });
};

export const updateUser = function ({ commit, state }) {
  const { profileData } = state;
  const { code, fullName, email, phone, referal_key } = profileData;
  const profile = { code, fullName, email, phone, referal_key };
  service
    .mutate(UpdateProfile, { profile })
    .then(data => {
      console.log(data.updateUser.stsCd)
      if(data.updateUser.stsCd === 'S')
        toastr.success(data.updateUser.msgCnt);
      else
        toastr.error(data.updateUser.msgCnt);
    })
    .catch(err => {
      toastr.error(err.message);
    });
};

export const updatePassword = function ({ commit, state }, profileData) {
  service
    .rest('updatePassword', profileData)
    .then(data => {
      if(data.stsCd === 'S')
        toastr.success(data.msgCnt);
      else
        toastr.error(data.msgCnt);
      //toastr.success('Password was updated');
    })
    .catch(err => {
      toastr.error(err.message);
    });
};

export const updateProfile = function ({ commit }, data) {
  commit(UPDATE_PROFILE, data);
};
