<template lang="pug">
div(v-loading.fullscreen.lock='fullLoading')
  b-card
    //- el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
    //-   el-form-item
    //-     el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.searchText', @keyup.enter.native='onTextSearchEnter($event)')           
    //-   el-form-item
    //-     el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
    el-form(:inline="true")
            el-form-item(label='')
              el-upload.upload-demo(drag='', ref="upload"
                action='/api/dbdn/import',
                :data='addOnData',
                :on-success='metSuccessUpload',
                :auto-upload='false',
                :limit="1",
                multiple=false)
                i.el-icon-upload
                .el-upload__text
                  | Kéo file vào đây hoặc
                  em  Nhấn để tải lên
            el-form-item(label='    ')
              el-button(size='small',type='info' , @click='submitUpload') Import
</template>

<script>
import VueRouter from 'vue-router';
const route = new VueRouter();
import { mapGetters, mapActions } from 'vuex';
import toastr from '../../core/toastr';
import moment from 'moment';

export default {
  computed: {
    ...mapGetters('dbdn', ['cicCfgLst', 'total', 'dialog', 'fullLoading']),
    ...mapGetters('session', ['me']),
    query() {
      return {
        searchText: this.formSearch.searchText,
        size: this.pageSize,
        skip: this.pageSize * (this.currentPage - 1)
      };
    },
    loginUsername() {
      return this.me ? this.me.username : ''
    },

    addOnData() {
      return {
        isWriteOver: 1,
      };
    },
  },

  data() {

    return {
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100, 200, 500],
      isNew: false,
      formSearch: {
        searchText: ''
      },
    };
  },

  methods: {
    ...mapActions('dbdn', [
      'getData',
      'saveCicCfg',
      'deleteCicCfg',
      'showPopup',
      'setLoading',
    ]),

    metOnSearch() {
      this.getData(this.query);
    },

    metSuccessUpload(response) {
      this.setLoading(false);
      this.$refs.upload.clearFiles();
      this.$alert(response.data.msgContent, response.data.msgTitle);
      //this.getContacts(this.query);
    },

    
    submitUpload() {
      this.setLoading(true);
      //this.$refs.upload.submit();
    },

  },

  watch: {},

  created() {
    this.getData(this.query);
  },

  mounted() {
    // this.$watch('formSearch.searchText', val => {
    //   this.getData(this.query);
    // });
  }
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
