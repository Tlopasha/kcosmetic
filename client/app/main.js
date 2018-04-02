'use strict';

require('es6-promise/auto');

import Vue from 'vue';

import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';

import Filters from './core/filters';
import VueI18Next from './core/i18next.js';
import VueFormGenerator from 'vue-form-generator';
import BootstrapVue from 'bootstrap-vue';

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '../scss/element-variables.scss';
import locale from 'element-ui/lib/locale/lang/en';

import store from './core/store';
import App from './core/App';
import updateData from './core/mixins/updateData';

Vue.use(Filters);

Vue.use(VueFormGenerator);
Vue.use(BootstrapVue);
Vue.use(ElementUI, { locale });
Vue.mixin(updateData);

//Vue.http.headers.common["X-CSRF-TOKEN"] = $("input[name="csrf"]").val();

// Register i18next localization module. We need to
// wait it before start the application!
Vue.use(VueI18Next, i18next => {
  const router = require('./core/router').default;
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
  });

  new Vue({
    el: '#app',
    components: {
      App,
    },
    router,
    store,
    render: h => h('app'),
  });
});
