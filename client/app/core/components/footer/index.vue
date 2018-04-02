<template lang="pug">
footer.footer
  .container-fluid
    nav
      ul
        li
          a(href='https://kcosmetic.vn')
            | LTV Co., Ltd
        li
          a(href='https://kcosmetic.vn/about')
            | About Us
        li
          a(href='https://blog.kcosmetic.vn')
            | Blog
    .copyright
      | ©
      | {{year}} 
      a(href='https://kcosmetic.vn', target='_blank') LTV Co., Ltd
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
