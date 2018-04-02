import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_DATAS, REMOVE, SET_DIALOG, FULL_LOADING } from './types';

let service = new Service('dbdn');

export const getData = function({ commit, state }, query) {
  return service.rest('getData', query)
    .then((data) => {
      commit(GET_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};

export const showPopup = function({ commit, state }, flag) {
  commit(SET_DIALOG, flag);
}



export const setLoading = function({commit, state}, bool){
  commit(FULL_LOADING, bool);
}
