import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_DATAS, REMOVE, SET_DIALOG } from './types';

let service = new Service('phonecheck');

export const getData = function({ commit, state }, query) {
  return service.rest('getData', query)
    .then((data) => {
      commit(GET_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};


export const resetCouter = function({ commit, state }, params) {
  let {data, query} = params;
  return service.rest('resetCouter', data)
    .then((respData) => {
      if (respData.status === 'ERROR') {
        toastr.error(respData.msgContent);
      } else {
        getData({ commit, state }, query);
        toastr.success('Lưu Thành Công');
      }
    }).catch((err) => {
      toastr.error(err.message);
    });
}

export const showPopup = function({ commit, state }, flag) {
  commit(SET_DIALOG, flag);
}

// export const deleteCicCfg = function({ commit, state }, params) {
//   let {id, query} = params;
//   return service.rest('deleteCicCfg', {id})
//     .then(() => {
//       getData({ commit, state }, query);
//       toastr.success('Xóa Thành Công');
//     }).catch((err) => {
//       toastr.error(err.message);
//     });
// };
