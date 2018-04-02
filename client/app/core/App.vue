<template lang="pug">
.wrapper
  sidebar
  .main-panel
    app-header
    .panel-header(:class='[isDashboard ? "panel-header-lg" : "panel-header-sm"]')
      big-chart(v-if='isDashboard', :data='bigChartDatas.datas', :labels='bigChartDatas.labels')
    .content
      .container-fluid
        router-view.animated.fadeIn(keep-alive)
      back-2-top(:duration='400')
    app-footer
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import {
  Header as AppHeader,
  Footer as AppFooter,
  Back2Top,
  Sidebar,
  BigChart,
} from './components/';
import Service from './service';

export default {
  /**
   * Load sub-components
   */
  components: {
    AppHeader,
    AppFooter,
    Back2Top,
    Sidebar,
    BigChart,
  },

  /**
   * Create app data object
   *
   * TODO: move to vuex state
   */
  data() {
    return {
      wsReconnecting: false,
      miniSidebar: false,
      //chartData: [],
      //chartLabels: [],
    };
  },

  computed: {
    ...mapGetters('dashboard', ['bigChartDatas']),
    
    isDashboard() {
      return this.$route.name === 'dashboard' || this.$route.path === '/';
    },

    name() {
      return this.$route.name;
    },

    userSession() {
      return this.$store.getters;
    },

    pannelHeaderSize() {
      return [this.isDashboard() ? 'panel-header-lg' : 'panel-header-sm'];
    },
  },

  watch: {
    $lng() {
      console.log('Language updated');
      this.update(this);
    },
  },

  methods: {
    ...mapActions('session', ['getSessionUser']),
    ...mapActions('dashboard', [
       'getBigChartData'
    ]),

    update: function(vm) {
      if (vm == null) return;

      let i = vm._watchers.length;
      while (i--) vm._watchers[i].update(true);

      let children = vm.$children;
      i = children.length;
      while (i--) this.update(children[i]);
    },

    toggleSidebar() {
      this.miniSidebar = !this.miniSidebar;
    },
  },

  /**
   * Application created
   */
  created() {
    console.log('App started!');
    window.app = this;
    if (this.isDashboard) {
      this.getBigChartData();
      // search big chart in dashboard
      // Thay vì setTimeout, nhớ lây dữ liệu từ sevice.
      // const data = [50, 150, 100, 190, 130, 90, 150, 160, 120, 140, 190, 95];
      // const labels = [
      //   'JAN',
      //   'FEB',
      //   'MAR',
      //   'APR',
      //   'MAY',
      //   'JUN',
      //   'JUL',
      //   'AUG',
      //   'SEP',
      //   'OCT',
      //   'NOV',
      //   'DEC',
      // ];
      // setTimeout(() => {
      //   this.chartData = data;
      //   this.chartLabels = labels;
      // }, 1000);

    }

    this.getSessionUser();
  },
};
</script>

<style lang="scss">
@import '../../scss/style.scss';
.animated.fadeIn {
  margin-bottom: 30px;
}
</style>
