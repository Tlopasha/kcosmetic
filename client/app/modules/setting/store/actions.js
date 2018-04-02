import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import { GET_DATA, UPDATE_DATA} from './types';

let service = new Service('cfgsetting');

export const getData = function({ commit, state }) {
  return service.rest('getData')
    .then((data) => {
      if(data){
        commit(GET_DATA, data);
      }
    }).catch((err) => {
      toastr.error(err.message);
    });
};


export const saveSetting = function({ commit, state }, params) {

  let  {LAST_CHECK_DAY, MAX_TIMES_SEARCH} = params;

  if(!LAST_CHECK_DAY || !MAX_TIMES_SEARCH){
    toastr.error('Không được để trống cái trường trong cài đật');
    return;
  }
  return service.rest('saveSetting', params)
    .then((respData) => {
      toastr.success('Configs were saved success');
    }).catch((err) => {
      toastr.error(err.message);
    });
}


export const updateData = function ({ commit }, data) {
  commit(UPDATE_DATA, data);
};


