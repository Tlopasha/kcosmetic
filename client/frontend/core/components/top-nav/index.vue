<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-absolute.navbar-transparent(color-on-scroll='500')
  .container
    .navbar-translate
      a.navbar-brand(href='/', rel='tooltip', title='Credit Score – Chấm điểm tín dụng “thần tốc” trong 60s', data-placement='bottom')
        | Credit Score
      button.navbar-toggler(type='button', data-toggle='collapse', data-target='#navigation', aria-controls='navigation-index', aria-expanded='false', aria-label='Toggle navigation')
        span.navbar-toggler-bar.bar1
        span.navbar-toggler-bar.bar2
        span.navbar-toggler-bar.bar3
    .collapse.navbar-collapse(data-nav-image='../assets/img/blurred-image-1.jpg', data-color='orange')
      ul.navbar-nav.ml-auto
        item(to='/', title='Home', icon="tech_mobile")
        item(to='/about', title='About', icon="emoticons_satisfied")
        item(to='/qa', title='Hỏi đáp', icon="ui-2_chat-round")
        //item(to='/login', title='Đăng nhập', icon="users_circle-08", v-if='isHome')
        item(to='/login', title='Đăng nhập', icon="users_circle-08")
        li.nav-item
          a.nav-link(href='http://fibo.vn/', target='_blank')
            i.now-ui-icons.objects_globe
            p @CreditScore
        li.nav-item
          a.nav-link(href='http://News.fibo.vn/', target='_blank')
            i.now-ui-icons.location_world
            p @Fibo

</template>

<script>
import Item from './item';

export default {
  components: {
    Item,
  },

  computed: {
    isHome() {
      return this.$route.path === '/' || this.$route.name === 'Home';
    },
  },

  created() {
  },
};
</script>

<style lang="scss" scoped>
.nav-cus {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}
</style>


