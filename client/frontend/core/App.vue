<template lang="pug">
.app
  top-nav
  .wrapper
    router-view.animated.fadeIn(keep-alive)
  //- app-footer(v-if='allowFooter')
</template>

<script>
import Vue from 'vue';
import { TopNav, Footer as AppFooter } from './components';

export default {
  components: {
    TopNav,
    AppFooter
  },

  data() {
    return {
      allowFooter: true
    }
  },

  created() {
    const { footer } = this.$route.matched[0].meta;
    this.allowFooter = footer === false ? false : true;
  }
};
</script>

<style lang="scss">
@import '../../scss/frontend.scss';
</style>
