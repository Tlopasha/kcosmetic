<template lang="pug">
router-link.nav-item(:to="to", tag="li", exact)
  a.nav-link
    i(:class='["now-ui-icons", icon]')
    p {{title}}
</template>

<script>
export default {
  props: {
    to: String,
    title: String,
    icon: String,
  },
};
</script>

<style>

</style>
