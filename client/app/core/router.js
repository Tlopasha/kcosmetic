'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

import Dashboard from '../modules/dashboard';
import Profile from '../modules/profile';
import User from '../modules/user';
import CicCfg from '../modules/cfgcic';
import CfgSelfDeclare from '../modules/cfgselfdeclare';
import Dbdn from '../modules/dbdn';
import Result from '../modules/result';
import Setting from '../modules/setting';
import Log from '../modules/phonecheck';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  linkActiveClass: 'open active',
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
    { path: '/profile', name: 'profile', component: Profile, meta: { title: 'Profile' } },
    { path: '/user', name: 'user', component: User, meta: { title: 'User' } },
    { path: '/ciccfg', name: 'ciccfg', component: CicCfg, meta: { title: 'CIC Config' } },
    { path: '/cfgselfdeclare', name: 'cfgselfdeclare', component: CfgSelfDeclare, meta: { title: 'Tự Khai' } },
    { path: '/result', name: 'result', component: Result, meta: { title: 'Kết Quả' } },
    { path: '/setting', name: 'setting', component: Setting, meta: { title: 'Setting' } },
    { path: '/log', name: 'log', component: Log, meta: { title: 'Log' } },
    { path: '/dbdn', name: 'dbdn', component: Dbdn, meta: { title: 'Import' } },
  ]
});
