<template lang="pug">
  b-card
    el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
      el-form-item
        el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.searchText', @keyup.enter.native='onTextSearchEnter($event)')           
      el-form-item
        el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
      el-form-item    
        el-button(type='success', icon='plus', @click='handleAddNew') {{_('Add')}}
    br
    el-row
      el-table(ref='multipleTable', :data='cicCfgLst', border='', style='width: 100%', @selection-change='handleSelectionChange')    
        el-table-column(:label='_("HanhDong")', width='120')
          template(slot-scope='scope')
            el-tooltip.item(effect='dark', content='Sửa', placement='left-start')
              el-button(size='small', @click='handleEdit(scope.$index, scope.row)', icon='el-icon-edit')
            el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
              el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')    
        el-table-column(prop='cib_msg',label='Kêt quả trên CIB', width='600')
        el-table-column(prop='cic_sys_rslt',label='Chọn kết quả trên hệ thống', width='300')
        el-table-column(prop='cic_result',label='Kết quả hệ thống', width='200')
        el-table-column(prop='point',label='Điểm /người', width='200')
        el-table-column(prop='random_point',label='Random -+', width='200')
        el-table-column(property='createAt', :label='_("createAt")', width='170')
          template(slot-scope='scope') {{formatDate(scope.row.createdAt)}}
       
    br
    el-row
      el-pagination(@size-change='handleSizeChange',
                    @current-change='handleCurrentChange', 
                    :current-page.sync='currentPage', 
                    :page-size='pageSize', 
                    :page-sizes='pageSizes', 
                    layout='total, sizes, prev, pager, next, jumper',
                    :total='total')

    el-dialog(:title='title',:visible='dialog', 
              :modal-append-to-body='false',
               @close='showPopup(false)')
      el-form(:model='formData', label-width='200px',  :rules="lstRule", ref="mainForm" )
        el-form-item(label='Kết quả trên CIB', prop='cib_msg')
          el-input(v-model='formData.cib_msg')
        el-form-item(label='Chọn kết quả trên hệ thống', prop='cic_sys_rslt')
          el-input(v-model='formData.cic_sys_rslt')
        el-form-item(label='Kết quả hệ thống', prop='cic_result')
          el-input(v-model='formData.cic_result')
        el-form-item(label='Điểm', prop='point')
          el-input(v-model='formData.point')
        el-form-item(label='Random', prop='random_point')
          el-input(v-model='formData.random_point')
            template(slot='prepend') - +
      span.dialog-footer(slot='footer')
        el-button(@click='showPopup(false)') {{_('btnClose')}}
        el-button(type='primary', @click='handleSave()') {{_('btnSave')}}

</template>

<script>
import VueRouter from 'vue-router';
const route = new VueRouter();
import { mapGetters, mapActions } from 'vuex';
import toastr from '../../core/toastr';
import moment from 'moment';

export default {
  computed: {
    ...mapGetters('cfgcic', ['cicCfgLst', 'total', 'dialog']),
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
      title: '',
      formData: {
        cib_msg: '',
        cic_sys_rslt: '',
        cic_result: '',
        point: 0,
        random_point: 0
      },
      lstRule : {
        cib_msg : [
          { required: true, message: 'Không được để trống', trigger: 'blur' }
        ],cic_sys_rslt : [
          { required: true, message: 'Không được để trống', trigger: 'blur' }
        ],cic_result : [
          { required: true, message: 'Không được để trống', trigger: 'blur' }
        ],point : [
          { required: true, message: 'Không được để trống', trigger: 'blur' }
        ],random_point : [
          { required: true, message: 'Không được để trống', trigger: 'blur' }
        ],
      }
      
    };
  },

  methods: {
    ...mapActions('cfgcic', [
      'getData',
      'saveCicCfg',
      'deleteCicCfg',
      'showPopup'
    ]),

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    
    handleEdit(index, row) {
      this.showPopup(true);
      this.isNew = false;
      this.title = 'Cập Nhật Thông Tin';
      this.formData = {
        _id: row._id,
        cib_msg: row.cib_msg,
        cic_sys_rslt: row.cic_sys_rslt,
        cic_result: row.cic_result,
        point: row.point,
        random_point: row.random_point
      };
    },

    handleAddNew() {
      this.showPopup(true);
      this.isNew = true;
      this.title = 'Tạo Thông Tin';
      this.formData = {
        cib_msg: '',
        cic_sys_rslt: '',
        cic_result: '',
        point: 0,
        random_point: 0
      };
    },

    handleDelete(index, row) {
      this.$confirm(this._('BanCoMuonXoa'), this._('Warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.deleteCicCfg({id : row._id, query: this.query});
      });
    },

    handleSave() {
      this.$refs['mainForm'].validate(valid => {
          if (valid) {
            this.formData.isNew = this.isNew;
            let params = {
              data: this.formData,
              query: this.query
            }
            this.saveCicCfg(params);
          }
          else{ return false;}
      });
    },

    metOnSearch() {
      this.getData(this.query);
    },

    onTextSearchEnter(event) {
      event.preventDefault();
      this.getData(this.query);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getData(this.query);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(this.query);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }
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
