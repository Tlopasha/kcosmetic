<template lang="pug">
footer.footer
  .container
    nav
      ul
        li
          a(href='http://www.fibo.vn') Fibo Group
        li
          a(href='http://www.news.fibo.vn') News
    .copyright
      span
        | COPYRIGHT
        | © 
        | {{currentYear}}
        | FIBO
</template>

<script>
export default {
  data() {
    return {
      currentYear: 2017
    }
  },

  created() {
    this.currentYear = new Date().getFullYear();
  }
};
</script>
