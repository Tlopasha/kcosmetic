<template lang="pug">
ol.breadcrumb
  li.breadcrumb-item(v-for='(item, index) in bcList', :key='item.name')
    span.active(v-if='isLast(index)') {{ item.name }}
    router-link(:to='item.path', v-else='') {{ item.name }}
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    isLast(index) {
      return index === this.list.length - 1
    },
  },
  computed: {
    bcList() {
      let bcList = this.list || []
      bcList = bcList.map(item => {
        if (item.meta && item.meta.label) {
          item.name = item.meta && item.meta.label
        }
        return item
      })
      return bcList
    }
  }
}
</script>
