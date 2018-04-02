<template lang="pug">
router-link(:to="to", tag="li", exact)
  a
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
