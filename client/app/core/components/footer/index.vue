<template lang="pug">
footer.footer
  .container-fluid
    nav
      ul
        li
          a(href='https://ltv.vn')
            | LTV Co., Ltd
        li
          a(href='https://ltv.vn/about')
            | About Us
        li
          a(href='https://blog.ltv.vn')
            | Blog
    .copyright
      | ©
      | {{year}} 
      a(href='https://ltv.vn', target='_blank') LTV Co., Ltd
      | .
</template>

<script>
export default {
  data() {
    const year = new Date().getFullYear();
    return {
      year
    };
  }
};
</script>

<style>

</style>
