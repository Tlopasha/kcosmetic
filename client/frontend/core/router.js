'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../modules/home';
import Login from '../modules/account/login';
import About from '../modules/about';
import Contact from '../modules/contact';
import QnA from '../modules/qna';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  linkActiveClass: 'open active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Credit Score – Chấm điểm tín dụng “thần tốc” trong 60s' }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login - Credit Score',
        footer: false
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'About Us - Credit Score',
        footer: false
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        title: 'Liên hệ - Credit Score',
        footer: false
      }
    },{
      path: '/qa',
      name: 'QnA',
      component: QnA,
      meta: {
        title: 'Q&A - Credit Score',
        footer: false
      }
    },
  ]
});
