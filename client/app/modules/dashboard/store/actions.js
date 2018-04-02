import Service from '../../../core/service';
import toastr from '../../../core/toastr';
import {
  GET_MONTHLY_CHART_DATA,
  GET_DAILY_CHART_DATA,
  GET_STATS,
  GET_BIG_CHART_DATA,
  GET_REFERALS,
  GET_LOGS
} from './types';

const NAMESPACE = '/api/dashboard';
const service = new Service('dashboard');

export const getBigChartData = ({ commit, state }) => {
  service.rest('getBigChartData')
    .then(data => {
      console.log('getBigChartData', data);
      commit(GET_BIG_CHART_DATA, data);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

export const getMonthlyChartDatas = ({ commit, state }) => {
  service.rest('getMonthlyChartDatas')
    .then(data => {
      console.log('getMonthlyChartDatas', data);
      commit(GET_MONTHLY_CHART_DATA, data);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

export const getDailyChartDatas = ({ commit, state }) => {
  service.rest('getDailyChartDatas')
    .then(data => {
      console.log('getDailyChartDatas', data);
      commit(GET_DAILY_CHART_DATA, data);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

export const getStatsCount = ({ commit, state }) => {
  service.rest('getStatsCount')
    .then(data => {
      commit(GET_STATS, data);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

export const getReferals = ({ commit, state }) => {
  service.rest('getReferals')
    .then(data => {
      console.log('getReferals', data.referalKeysObj);
      
      commit(GET_REFERALS, data.referalKeysObj);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

export const getLogInfo = ({ commit, state }, query) => {
  service.rest('getLogInfo', query)
    .then(data => {
      console.log('getLogInfo', data);
      
      commit(GET_LOGS, data);
    })
    .catch(err => {
      toastr.error(err.message);
    })
    .then()
}

