import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_DATAS, GET_ALL_DATAS, REMOVE, SET_DIALOG,UPDATE_LIST } from './types';

let service = new Service('cfgselfdeclare');

export const getData = function({ commit, state }, query) {
  return service.rest('getData', query)
    .then((data) => {
      commit(GET_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};

export const getAllData = function({ commit, state }) {
  return service.rest('getAllData')
    .then((data) => {
      console.log(data);
      commit(GET_ALL_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};



export const saveDeclare = function({ commit, state }, params) {

  let {data, query} = params;
  

  return service.rest('saveDeclare', data)
    .then((respData) => {
      if (respData.status === 'ERROR') {
        toastr.error(respData.msgContent);
      } else {
        getData({ commit, state }, query);
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

export const deleteCicCfg = function({ commit, state }, params) {
  let {id, query} = params;
  return service.rest('deleteCicCfg', {id})
    .then(() => {
      getData({ commit, state }, query);
      toastr.success('Xóa Thành Công');
    }).catch((err) => {
      toastr.error(err.message);
    });
};

export const updateList = function ({ commit }, data) {
  commit(UPDATE_LIST, data);
};
