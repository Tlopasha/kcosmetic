<template lang="pug">
.page-header.section-image
  .page-header-image
  .content
    .container
      .row
        h1 Contact
  app-footer
</template>

<script>
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';


export default {
  components: {
    AppFooter
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  min-height: 100vh;
  max-height: 999px;
  padding: 0;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
.page-header-image {
  background-image: url('~images/bg/bg18.jpg');
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
