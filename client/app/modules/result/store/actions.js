import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_DATAS, REMOVE, SET_DIALOG } from './types';

let service = new Service('result');

export const getData = function({ commit, state }, query) {
  return service.rest('getData', query)
    .then((data) => {
      commit(GET_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};


export const saveResult = function({ commit, state }, params) {

  let {data, query} = params;
  

  return service.rest('saveResult', data)
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

export const deleteResult = function({ commit, state }, params) {
  let {id, query} = params;
  return service.rest('deleteResult', {id})
    .then(() => {
      getData({ commit, state }, query);
      toastr.success('Xóa Thành Công');
    }).catch((err) => {
      toastr.error(err.message);
    });
};
