import Vue from 'vue';
import toastr from '../../../core/toastr';
import Service from '../../../core/service';
import {
  GET_DATAS,
  FULLLOADING,
  TIME,
  VISABLERESULT,
  VISABLEDEPTH,
  FILL_RESULT,
  IS_RESCORED,
  SHOW_DEPTH_POINT,
  UPDATE_CURRENCY,
  PROGRESS_NO,
  UPDATE_SELECTED_COMPANY,
  SET_DEFAULT_VALUE,
  IS_DENIED
} from './types';

let service = new Service('home');
let cicService = new Service('cic');
import { randomIntFromInterval } from '../../../../common';


export const checkCic = ({ commit, state }, params) => {
  console.log(params);
  let { id } = params;
  if (!/^[\d]+$/.test(id.trim().replace(/[\s\r\n]+/g, ''))) {
    toastr.warning('Vui lòng nhập số chứng minh nhân dân chính xác');
    return;
  }

  let now = randomIntFromInterval(5,10);
  commit(PROGRESS_NO, now);
  let interval = window.setInterval(() => {
    if(now < 97){
      if(now > 30)
        now += 1;
      else
        now += 2;
      if (now == 14)
        now += 5;
      if (now == 23)
        now += 7;
      if (now == 35)
        now += 10;
      commit(PROGRESS_NO, now);
    }
  }, 1000);


  cicService.rest('checkCic', params)
    .then((data) => {

      setTimeout(() => {
        console.log('checkCic', data);
        if (data.msgCd === 'S') {

          commit(FILL_RESULT, data.data)
          commit(VISABLERESULT, true);
          commit(IS_DENIED, false);
          
        } else {
          toastr.error(data.msgCnt);
          if (data.data)
            commit(FILL_RESULT, data.data)
            commit(IS_DENIED, true);
            commit(VISABLERESULT, true);
        }

        //commit(FULLLOADING, false);
        window.clearInterval(interval);
        commit(PROGRESS_NO, 0);

      }, 6000);

      //commit(GET_CIC_INFO, data);
    }).catch((err) => {
      //commit(FULLLOADING, false);
      window.clearInterval(interval);
      commit(PROGRESS_NO, 0);
      //commit(LOADING, false);
      toastr.error('Hệ thống gặp chút vấn đề về xử lý thông tin, vui lòng thử lại.');
      console.log('checkCic', err);
    })
};

export const getData = function ({ commit, state }) {
  console.log('getData')
  return service.rest('getData')
    .then((data) => {
      console.log(data);
      commit(GET_DATAS, data);
    }).catch((err) => {
      toastr.error(err.message);
    });
};


export const turnFullLoading = function ({ commit, state }, flag) {
  commit(FULLLOADING, flag);
};

export const changeTime = function ({ commit, state }, data) {
  commit(TIME, data);
};

export const turnVisableDepth = function ({ commit, state }, data) {
  commit(VISABLEDEPTH, data);
};

export const turnVisableResult = function ({ commit, state }, data) {
  commit(VISABLERESULT, data);
};

export const turnIsRescored = function ({ commit, state }, data) {
  commit(IS_RESCORED, data);
};

export const turnIsDenied= function ({ commit, state }, data) {
  commit(IS_DENIED, data);
};



export const turnshowDepthPoint = function ({ commit, state }, data) {
  commit(SHOW_DEPTH_POINT, data);
};

// const updateProgess =({ commit, state }, value)=>{

//     commit(PROGRESS_NO, value);
//     let newValue = randomIntFromInterval(value, value + 5);
  
//     setTimeout(() => {
//       commit(PROGRESS_NO, newValue);
//       let newValue1 = randomIntFromInterval(newValue, newValue + 5);

//       setTimeout(() => {
//         commit(PROGRESS_NO, newValue1);
//         let newValue2 = randomIntFromInterval(newValue1, newValue1 + 5);

//         setTimeout(() => {
//           commit(PROGRESS_NO, newValue2);
//           let newValue2 = randomIntFromInterval(newValue2, newValue2 + 5);
//         }, 15600);

//       }, 14000);

//     }, 2000);
// },

export const depthRescore = ({ commit, state }, params) => {


  let now = randomIntFromInterval(5,10);
  commit(PROGRESS_NO, now);
  let interval = window.setInterval(() => {
    if(now < 97){
      if(now > 30)
        now += 1;
      else
        now += 3;
      if (now == 14)
        now += 5;
      if (now == 23)
        now += 7;
      if (now == 35)
        now += 10;
      commit(PROGRESS_NO, now);
    }
  }, 1000);

  cicService.rest('depthRescore', params)
    .then((data) => {

      setTimeout(() => {
        if (data.msgCd === 'S') {
          commit(FILL_RESULT, data.data)
          commit(IS_RESCORED, true);
          commit(VISABLERESULT, true);
        } else {
          toastr.error(data.msgCnt);
          if (data.data)
            commit(FILL_RESULT, data.data)
        }

        commit(SHOW_DEPTH_POINT, true);
        window.clearInterval(interval);
        commit(PROGRESS_NO, 0);
      }, 10000);

    }).catch((err) => {
      window.clearInterval(interval);
      commit(PROGRESS_NO, 0);
      //commit(LOADING, false);
      toastr.error('Hệ thống gặp chút vấn đề về xử lý thông tin, vui lòng thử lại.');
      console.log('depthRescore', depthRescore)
    })
};



export const sendFinalResult = ({ commit, state }, params) => {


  cicService.rest('sendFinalResult', params)
    .then((data) => {

    }).catch((err) => {
      console.log('Sent result error', err)
    })
};


export const updateData = ({ commit, state }, params) => {
  commit(UPDATE_CURRENCY, params);
};

export const updateSelectedCompany = ({ commit, state }, data) => {
  commit(UPDATE_SELECTED_COMPANY, data);
};

export const setDefaultValue = ({ commit, state }, data) => {
  commit(SET_DEFAULT_VALUE, data);
};
