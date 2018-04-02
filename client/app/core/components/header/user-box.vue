<template lang="pug">
b-nav-item-dropdown.user-box(right="")
  template(slot="button-content", v-if="me")
    img.img-avatar(:src="me.avatar", :alt="me.fullName")
  b-dropdown-header.text-center(tag="div")
    strong Account
  b-dropdown-item(href="/#/profile")
    i.fa.fa-user
    |  Profile
  b-dropdown-item(href='/#/settings')
    i.fa.fa-wrench
    |  Settings
  b-dropdown-item(href="javascript:;", @click="logout($event)")
    i.fa.fa-lock
    |  Logout
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: mapGetters('session', ['me']),

  components: {},

  data() {
    return {};
  },

  methods: {
    logout(e) {
      e.preventDefault();
      axios.get('/logout').then(resp => {
        window.location.href = '/';
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-box {
  margin: 0 15px !important;
}
</style>
