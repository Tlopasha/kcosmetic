<template lang="pug">
  b-card
    .form-group
      label Kiểm tra lại CIC khi quá
      input.form-control(:value='dataSetting.LAST_CHECK_DAY', required=true
                          @input="__u('LAST_CHECK_DAY', $event.target.value, updateData)")
    .form-group
      label Số lần check CIC tối đa
      input.form-control(:value='dataSetting.MAX_TIMES_SEARCH', required=true
                          @input="__u('MAX_TIMES_SEARCH', $event.target.value, updateData)")
    .form-group
      button.btn.btn-round.btn-info(type='info', @click='handleSave') Lưu

</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import toastr from '../../core/toastr';
import moment from 'moment';

export default {
  computed: {
    ...mapGetters('setting', ['dataSetting']),
  },

  data() {
    return {};
  },

  methods: {
    ...mapActions('setting', ['getData', 'saveSetting', 'updateData']),

    handleSave() {
      this.saveSetting(this.dataSetting);
    },
  },

  created() {
    this.getData();
  },


};
</script>
<style lang='scss'>
.el-dialog {
  width: 65% !important;
}
.container {
  padding-bottom: 1rem;
}

.header {
  margin: 1rem;
}

.el-dialog {
  z-index: 100;
}
</style>
