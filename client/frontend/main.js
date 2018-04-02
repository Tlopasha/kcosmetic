'use strict';
console.log('Frontend loaded!');
require('es6-promise/auto');

import Vue from 'vue';
import Filters from './core/filters';
import VueI18Next from './core/i18next.js';
import BootstrapVue from 'bootstrap-vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';

import store from './core/store';
import App from './core/App';

axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.use(Filters);
Vue.use(BootstrapVue);
Vue.use(ElementUI, { locale });
Vue.directive('title', {
  inserted: (el, binding) => document.title = binding.value,
  update: (el, binding) => document.title = binding.value
});

Vue.use(VueI18Next, (i18next) => {
  const router = require('./core/router').default;
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
  });
  
  new Vue({
    el: '#app',
    components: {
      App
    },
    router,
    store,
    render: h => h('app')
  });
});
