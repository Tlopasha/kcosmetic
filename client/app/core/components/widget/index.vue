<template lang="pug">
.card
  .card-header
    h5(v-if='category').card-category {{category}}
    h4.card-title {{title}}
    slot(name='action')
  .card-body
    slot
  .card-footer
    slot(name='footer')
</template>

<script>
export default {
  props: {
    category: String,
    title: String,
    action: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    hasFooterSlot() {
      return !!this.$slots['footer'];
    },

    hasActionSlot() {
      return !!this.$slots['action'];
    },
  },
};
</script>

<style scoped>

</style>
