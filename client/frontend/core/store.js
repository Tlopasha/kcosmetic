import Vue from 'vue';
import Vuex from 'vuex';
import home from './../modules/home/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home
  }
});
