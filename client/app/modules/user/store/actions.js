import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_USERS, REMOVE, SET_DIALOG } from './types';

let service = new Service('user');

export const getUsers = function({ commit, state }, query) {
  return service.rest('getUsers', query)
    .then((data) => {
      commit(GET_USERS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};


export const saveUsers = function({ commit, state }, params) {
  let {data, query} = params;
  return service.rest('saveUsers', data)
    .then((resData) => {
      if (resData.status === 'ERROR') {
        toastr.error(resData.msgContent);
      } else {
        getUsers({ commit, state },query);
        showPopup({ commit, state }, false);
        toastr.success('Lưu Thành Công');
      }
    }).catch((err) => {
      toastr.error(err.message);
    });
}

export const showPopup = function({ commit, state }, flag) {
  commit(SET_DIALOG, flag);
}

export const deleteUser = function({ commit, state }, params) {
  let {id, query} = params;
  
  return service.rest('deleteUser', {id})
    .then(() => {
      getUsers({ commit, state }, query);
      toastr.success('Xóa Thành Công');
    }).catch((err) => {
      toastr.error(err.message);
    });
};
